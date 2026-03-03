"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PRODUCT_FALLBACK_IMAGE } from "@/config/constants";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({ src, alt, className, sizes, priority }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || PRODUCT_FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(src || PRODUCT_FALLBACK_IMAGE);
  }, [src]);

  const isExternal = imgSrc.startsWith('http') && !imgSrc.includes('localhost');

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes || "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
      className={className}
      onError={() => setImgSrc(PRODUCT_FALLBACK_IMAGE)}
      priority={priority}
      unoptimized={isExternal}
    />
  );
}