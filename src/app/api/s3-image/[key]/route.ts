import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Get the key from the URL params (it will be URL-encoded)
    const key = decodeURIComponent(params.key);
    
    // Only allow access to the profiles folder for security
    if (!key.startsWith("profiles/")) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Fetch the object from S3
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);
    
    if (!response.Body) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Convert the readable stream to a buffer
    const buffer = await streamToBuffer(response.Body as Readable);

    // Determine content type from S3 metadata or default to jpeg
    const contentType = response.ContentType || "image/jpeg";

    // Return the image with proper content type
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    });
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}