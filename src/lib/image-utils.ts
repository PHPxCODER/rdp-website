/**
 * Transforms S3 URLs to use our proxy API
 * @param src The source URL to transform
 * @returns Transformed URL that uses our proxy API if it's an S3 URL
 */
export function transformS3Url(src: string | null | undefined): string {
    if (!src) return '';
    
    // Check if this is an S3 URL for our bucket
    if (src.includes('rdpdc.s3.ap-south-1.amazonaws.com/profiles/')) {
      // Extract the key part (profiles/filename.jpg)
      const keyMatch = src.match(/rdpdc\.s3\.ap-south-1\.amazonaws\.com\/(profiles\/[^?]+)/);
      if (keyMatch && keyMatch[1]) {
        // Return URL to our API proxy
        return `/api/s3-image/${encodeURIComponent(keyMatch[1])}`;
      }
    }
    
    // Return original URL if not an S3 URL or pattern doesn't match
    return src;
  }