"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Star } from "lucide-react";
import Image from "next/image";
import { uploadProductImage } from "@/features/vendor/actions";
import { toast } from "sonner";

interface ProductImage {
  url: string;
  isMain: boolean;
  order: number;
}

interface MultiImageUploadProps {
  value: ProductImage[];
  onChange: (value: ProductImage[]) => void;
  disabled?: boolean;
}

export function MultiImageUpload({
  value,
  onChange,
  disabled,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadProductImage(formData);
        if (response.success && response.data) {
          return {
            url: response.data,
            isMain: false,
            order: value.length,
          };
        }
        throw new Error("Upload failed");
      });

      try {
        const newImages = await Promise.all(uploadPromises);
        const updatedImages = [...value, ...newImages];
        
        // If no main image, set first one as main
        if (!updatedImages.find(img => img.isMain) && updatedImages.length > 0) {
          updatedImages[0].isMain = true;
        }
        
        onChange(updatedImages);
        toast.success(`${newImages.length} image(s) ajoutée(s)`);
      } catch (error) {
        toast.error("Erreur lors de l'upload d'une ou plusieurs images");
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: disabled || isUploading,
  });

  const removeImage = (url: string) => {
    const updatedImages = value.filter((img) => img.url !== url);
    // If we removed the main image, pick a new one
    if (value.find(img => img.url === url)?.isMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    onChange(updatedImages);
  };

  const setMainImage = (url: string) => {
    const updatedImages = value.map((img) => ({
      ...img,
      isMain: img.url === url,
    }));
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="bg-primary/10 p-3 rounded-full">
          <ImageIcon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            {isUploading ? "Upload en cours..." : "Glissez-déposez vos images ici"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG ou WebP jusqu'à 5MB
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((image, index) => (
            <div
              key={image.url}
              className="relative group aspect-square rounded-md overflow-hidden border bg-muted"
            >
              <Image
                src={image.url}
                alt={`Image ${index + 1}`}
                className="object-cover transition-transform group-hover:scale-105"
                fill
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant={image.isMain ? "default" : "secondary"}
                  className="h-8 w-8"
                  type="button"
                  onClick={() => setMainImage(image.url)}
                  title={image.isMain ? "Image principale" : "Définir comme principale"}
                >
                  <Star className={cn("h-4 w-4", image.isMain && "fill-current")} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  type="button"
                  onClick={() => removeImage(image.url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">
                  Principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
