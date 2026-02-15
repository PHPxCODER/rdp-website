import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid'; // For generating request IDs

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

// Define types for error responses
interface ErrorResponseDetails {
  resource?: string;
  requiresAuth?: boolean;
  reason?: string;
  userId?: string;
  errorType?: string;
  errorMessage?: string;
  [key: string]: unknown; // Allow for additional properties while maintaining type safety
}

interface ErrorResponse {
  success: false;
  error: {
    status: number;
    message: string;
    details: ErrorResponseDetails;
    requestId: string;
    timestamp: string;
  };
}

/**
 * Convert stream to buffer
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/**
 * Create a standardized error response that is pretty-printed for readability
 */
function createErrorResponse(status: number, message: string, details?: ErrorResponseDetails): NextResponse<ErrorResponse> {
  // Generate a request ID (similar to Cloudflare Ray ID)
  const requestId = `req_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
  
  const errorResponseBody: ErrorResponse = {
    success: false,
    error: {
      status,
      message,
      details: details || {},
      requestId,
      timestamp: new Date().toISOString()
    }
  };
  
  // Pretty-print the JSON with 2-space indentation for readability
  const prettyJson = JSON.stringify(errorResponseBody, null, 2);
  
  return new NextResponse(prettyJson, { 
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      'X-Content-Type-Options': 'nosniff' // Prevent content type sniffing
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Get the authenticated user session
    const session = await auth.api.getSession({ headers: await headers() });

    // If not authenticated, return 401 Unauthorized
    if (!session || !session.user) {
      return createErrorResponse(401, "Authentication required to access this resource", {
        resource: "private-image",
        requiresAuth: true
      });
    }

    // Get the key from the URL params (it will be URL-encoded)
    const filename = decodeURIComponent(params.key);
    
    // Construct the full S3 key with the profiles/ prefix
    const key = `profiles/${filename}`;

    // First, check if this image belongs to the current user
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      
      await s3.send(headCommand);
      
      // If the file exists, check if it's associated with the current user
      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { image: true },
      });
      
      // Check if this is the user's profile image
      const isUsersImage = currentUser?.image?.includes(filename);
      
      // If it's not the user's image, return 403 Forbidden
      if (!isUsersImage) {
        return createErrorResponse(403, "Access denied: You don't have permission to access this resource", {
          resource: "private-image",
          reason: "not_owner",
          userId: session.user.id
        });
      }
    } catch (error) {
      console.error("Error checking image metadata:", error);
      return createErrorResponse(404, "The requested resource was not found", {
        resource: `profiles/${filename}`,
      });
    }

    // Now fetch the actual image data
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);
    
    if (!response.Body) {
      return createErrorResponse(404, "The requested resource was not found", {
        resource: `profiles/${filename}`,
      });
    }

    // Convert the readable stream to a buffer
    const buffer = await streamToBuffer(response.Body as Readable);

    // Determine content type from S3 metadata or default to jpeg
    const contentType = response.ContentType || "image/jpeg";
    
    // Generate a request ID for successful responses too
    const requestId = `req_${uuidv4().replace(/-/g, '').substring(0, 16)}`;

    // Return the image with proper content type
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600", // Private cache for 1 hour
        "Pragma": "no-cache", // Additional cache control header
        "X-Request-ID": requestId, // Add request ID to successful responses too
        "X-Content-Type-Options": "nosniff" // Prevent content type sniffing
      },
    });
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return createErrorResponse(500, "An unexpected error occurred while processing your request", {
      errorType: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
}
