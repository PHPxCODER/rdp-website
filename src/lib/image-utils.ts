// src/lib/image-utils.ts

/**
 * Transforms image URLs to use CloudFront distribution
 * @param src The source URL to transform
 * @returns CloudFront URL or original URL if not transformable
 */
export function transformS3Url(src: string | null | undefined): string {
  if (!src) return '';
  
  // If it's already a CloudFront URL, return as is
  if (src.includes('cdn.rdpdatacenter.in')) {
    return src;
  }
  
  // Check if this is an old S3 URL format that needs to be converted
  if (src.includes('rdpdc.s3.') && src.includes('/profiles/')) {
    // Extract the filename part (after profiles/)
    const profilesMatch = src.match(/\/profiles\/([^?]+)/);
    if (profilesMatch && profilesMatch[1]) {
      return `https://cdn.rdpdatacenter.in/profiles/${profilesMatch[1]}`;
    }
  }
  
  // Check if this is a direct S3 bucket URL
  if (src.includes('s3.amazonaws.com/rdpdc/profiles/')) {
    const filenameMatch = src.match(/s3\.amazonaws\.com\/rdpdc\/profiles\/([^?]+)/);
    if (filenameMatch && filenameMatch[1]) {
      return `https://cdn.rdpdatacenter.in/profiles/${filenameMatch[1]}`;
    }
  }
  
  // Return original URL if it doesn't match any S3 patterns
  return src;
}

/**
 * Get the CloudFront URL for a profile image
 * @param filename The image filename (e.g., "uuid.jpg")
 * @returns Full CloudFront URL
 */
export function getProfileImageUrl(filename: string): string {
  if (!filename) return '';
  
  // Remove any existing path prefixes if they exist
  const cleanFilename = filename.replace(/^.*\//, '');
  
  return `https://cdn.rdpdatacenter.in/profiles/${cleanFilename}`;
}

/**
 * Extract filename from any image URL format
 * @param url The image URL
 * @returns Just the filename with extension
 */
export function extractFilename(url: string): string {
  if (!url) return '';
  
  // Remove query parameters and extract filename
  const urlWithoutQuery = url.split('?')[0];
  const parts = urlWithoutQuery.split('/');
  return parts[parts.length - 1];
}