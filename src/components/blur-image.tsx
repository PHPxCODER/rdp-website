"use client";

import cn from "clsx";
import Image from "next/image";
import { useState, useMemo } from "react";
import { transformS3Url } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";

import type { ComponentProps } from "react";

// Next.js image optimization error interface
interface NextImageError {
  statusCode: number;
  code: string; // e.g. 'INVALID_IMAGE_OPTIMIZE_REQUEST'
  error: string;
  id: string; // The error ID, e.g. 'bom1::xxx-xxx'
}

export default function BlurImage(props: ComponentProps<typeof Image>) {
  const [isLoading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    status?: number;
    message?: string;
    requestId?: string;
    code?: string;
  } | null>(null);
  
  const { toast } = useToast();
  
  // Transform S3 URLs to use our proxy API
  const transformedSrc = useMemo(() => {
    if (typeof props.src !== 'string') return props.src;
    return transformS3Url(props.src);
  }, [props.src]);

  // Handle image load error
  const handleError = async (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    setLoading(false);
    
    // Try to extract the error details from the image element
    const imgElement = event.currentTarget;
    let errorInfo: NextImageError | null = null;
    
    try {
      // Check if we have an error attribute on the image
      const errorAttr = imgElement.getAttribute('data-error');
      if (errorAttr) {
        errorInfo = JSON.parse(errorAttr);
      }
    } catch (error) {
      // Just log the error without storing it in a variable
      console.error("Failed to parse image error data:", error);
    }
    
    // If this is a Next.js Image error
    if (errorInfo) {
      setErrorDetails({
        status: errorInfo.statusCode,
        message: errorInfo.error,
        code: errorInfo.code,
        requestId: errorInfo.id
      });
      
      toast({
        title: `Image Error ${errorInfo.statusCode}: ${errorInfo.code}`,
        description: `${errorInfo.error} (ID: ${errorInfo.id})`,
        variant: "destructive",
      });
      return;
    }
    
    // If we don't have Next.js error info, try to fetch error details from our API
    if (typeof props.src === 'string' && props.src.includes('rdpdc.s3.ap-south-1.amazonaws.com')) {
      try {
        // Make a fetch call to get the error details
        const transformedUrl = transformS3Url(props.src);
        const response = await fetch(transformedUrl);
        
        if (!response.ok) {
          // Try to parse the error JSON
          try {
            const errorData = await response.json();
            setErrorDetails({
              status: errorData.error?.status,
              message: errorData.error?.message,
              requestId: errorData.error?.requestId
            });
            
            // Show a toast with the error
            toast({
              title: `Image Error (${errorData.error?.status})`,
              description: `${errorData.error?.message} (Request ID: ${errorData.error?.requestId})`,
              variant: "destructive",
            });
          } catch (error) {
            // Simply log without storing in a variable
            console.error("Failed to parse error response:", error);
            
            // Still set error details using response status
            setErrorDetails({
              status: response.status,
              message: response.statusText
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch error details:", error);
      }
    }
  };

  // If image fails to load, show a placeholder
  if (imageError) {
    return (
      <div 
        className={cn(
          "bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-col",
          props.className
        )}
      >
        {/* Show the first letter of the alt text as a placeholder */}
        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          {props.alt?.charAt(0) || "?"}
        </span>
        
        {/* If we have error details, show them in small text */}
        {errorDetails && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center px-2">
            {errorDetails.code ? (
              <>
                <p>Error {errorDetails.status}: {errorDetails.code}</p>
                {errorDetails.requestId && (
                  <p className="text-[10px]">ID: {errorDetails.requestId}</p>
                )}
              </>
            ) : (
              <>
                <p>Error {errorDetails.status}</p>
                {errorDetails.requestId && (
                  <p className="text-[10px]">ID: {errorDetails.requestId}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={transformedSrc}
      alt={props.alt}
      className={cn(
        props.className,
        "duration-700 ease-in-out",
        isLoading ? "scale-105 blur-lg" : "scale-100 blur-0",
      )}
      onLoad={() => setLoading(false)}
      onError={handleError}
    />
  );
}