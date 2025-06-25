import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client with your actual region
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-2', // Updated to your actual region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'rdpdc';
const CLOUDFRONT_URL = 'https://cdn.rdpdatacenter.in'; // Your CloudFront distribution URL

/**
 * Generates a presigned URL for direct upload to S3
 * @param contentType MIME type of the file
 * @returns Object containing URL, form fields, and the final CloudFront URL of the uploaded file
 */
export async function generateUploadUrl(contentType: string) {
  try {
    // Generate a unique filename with proper extension
    const extension = getExtensionFromContentType(contentType);
    const fileName = `${uuidv4()}.${extension}`;
    const key = `profiles/${fileName}`;

    // Create a presigned POST request (without ACL since bucket has ACLs disabled)
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: BUCKET_NAME,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 5 * 1024 * 1024], // Max 5MB
        ['eq', '$Content-Type', contentType], // Ensure content type matches
      ],
      Fields: {
        'Content-Type': contentType,
        // Removed ACL field since bucket has ACLs disabled
      },
      Expires: 300, // URL expires in 5 minutes
    });

    // Generate the CloudFront URL that the file will have after upload
    const fullUrl = `${CLOUDFRONT_URL}/${key}`;

    return {
      url,
      fields,
      fullUrl,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

/**
 * Get file extension from MIME type
 * @param contentType MIME type string
 * @returns Appropriate file extension
 */
function getExtensionFromContentType(contentType: string): string {
  const mapping: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };

  return mapping[contentType] || 'jpg';
}