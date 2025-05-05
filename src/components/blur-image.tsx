"use client";

import cn from "clsx";
import Image from "next/image";
import { useState, useMemo } from "react";
import { transformS3Url } from "@/lib/image-utils";

import type { ComponentProps } from "react";

export default function BlurImage(props: ComponentProps<typeof Image>) {
  const [isLoading, setLoading] = useState(true);
  
  // Transform S3 URLs to use our proxy API
  const transformedSrc = useMemo(() => {
    if (typeof props.src !== 'string') return props.src;
    return transformS3Url(props.src);
  }, [props.src]);

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
    />
  );
}