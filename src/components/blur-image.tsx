"use client";

import cn from "clsx";
import Image from "next/image";
import { useState, useMemo } from "react";
import { transformS3Url } from "@/lib/image-utils";

import type { ComponentProps } from "react";

export default function BlurImage(props: ComponentProps<typeof Image>) {
  const [isLoading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Transform S3 URLs to use CloudFront
  const transformedSrc = useMemo(() => {
    if (typeof props.src !== 'string') return props.src;
    return transformS3Url(props.src);
  }, [props.src]);

  // Handle image load error
  const handleError = () => {
    setImageError(true);
    setLoading(false);
  };

  // If image fails to load, show a placeholder
  if (imageError) {
    return (
      <div 
        className={cn(
          "bg-gray-200 dark:bg-gray-800 flex items-center justify-center",
          props.className
        )}
      >
        {/* Show the first letter of the alt text as a placeholder */}
        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          {props.alt?.charAt(0) || "?"}
        </span>
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