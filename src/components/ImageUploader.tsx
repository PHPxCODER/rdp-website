"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import BlurImage from "@/components/blur-image";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (file: File | null, preview: string | null) => void;
  className?: string;
  shape?: "square" | "circle";
  size?: "sm" | "md" | "lg";
}

export default function ImageUploader({
  initialImage,
  onImageChange,
  className = "",
  shape = "circle",
  size = "md",
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImage || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Size classes based on the size prop
  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-32 w-32",
    lg: "h-40 w-40",
  }[size];

  // Handle file selection
  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WEBP or GIF file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Notify parent component
    onImageChange(file, objectUrl);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  // Reset to initial image
  const handleReset = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(initialImage || null);
    onImageChange(null, initialImage || null);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Image Container */}
      <div
        className={`
          relative ${sizeClasses} overflow-hidden border-2 border-primary/50
          ${shape === "circle" ? "rounded-full" : "rounded-lg"}
          ${isDragging ? "border-dashed border-primary" : ""}
          transition-all duration-200 cursor-pointer
        `}
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <BlurImage
            src={previewUrl}
            alt="Profile picture"
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-secondary text-secondary-foreground text-4xl font-bold">
            +
          </div>
        )}

        {/* Overlay with instructions */}
        <div className={`
          absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200
          ${isDragging || !previewUrl ? 'opacity-70' : 'opacity-0 hover:opacity-70'}
        `}>
          <span className="text-white text-sm text-center px-2">
            {isDragging ? "Drop image here" : "Click or drag to upload"}
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="flat"
          color="primary"
          size="sm"
          onPress={triggerFileInput}
        >
          Choose Image
        </Button>
        
        {previewUrl && previewUrl !== initialImage && (
          <Button
            type="button"
            variant="flat"
            color="danger"
            size="sm"
            onPress={handleReset}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}