/**
 * Transforms S3 URLs to use our proxy API
 * @param src The source URL to transform
 * @param isPublic Optional flag to indicate if this is a public image that doesn't need auth
 * @returns Transformed URL that uses our proxy API if it's an S3 URL
 */
export function transformS3Url(src: string | null | undefined, isPublic: boolean = false): string {
  if (!src) return '';
  
  // Check if this is an S3 URL for our bucket
  if (src.includes('rdpdc.s3.ap-south-1.amazonaws.com/profiles/')) {
    // Extract just the filename part (after the last slash)
    const filenameMatch = src.match(/rdpdc\.s3\.ap-south-1\.amazonaws\.com\/profiles\/([^?]+)/);
    if (filenameMatch && filenameMatch[1]) {
      // For public images (like team photos) use public endpoint
      if (isPublic) {
        return `/api/public-image/${encodeURIComponent(filenameMatch[1])}`;
      }
      // For private user images, use the secure endpoint
      return `/api/s3-image/${encodeURIComponent(filenameMatch[1])}`;
    }
  }
  
  // Return original URL if not an S3 URL or pattern doesn't match
  return src;
}

/**
 * Generate a safe image URL that works for both authenticated and unauthenticated users
 * @param userId The user ID who owns the image
 * @param filename The image filename
 * @returns URL with embedded user ID for authorization
 */
export function generateSecureImageUrl(userId: string, filename: string): string {
  return `/api/user-image/${userId}/${encodeURIComponent(filename)}`;
}
