"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

interface ImageUploadProps {
  value?: string | null;
  onUpload: (storageId: Id<"_storage">) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: "square" | "video";
}

export function ImageUpload({
  value,
  onUpload,
  onRemove,
  className,
  aspectRatio = "video",
}: ImageUploadProps) {
  const generateUploadUrl = useMutation(api.tasks.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = (await result.json()) as {
          storageId: Id<"_storage">;
        };
        onUpload(storageId);
      } finally {
        setIsUploading(false);
        if (preview) {
          URL.revokeObjectURL(preview);
          setPreview(null);
        }
      }
    },
    [generateUploadUrl, onUpload, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading,
    onDrop: (accepted) => {
      const file = accepted[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        handleUpload(file);
      }
    },
  });

  const displayUrl = preview ?? value;

  if (displayUrl) {
    return (
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg border",
          aspectRatio === "square" ? "aspect-square" : "aspect-video",
          className
        )}
      >
        <Image
          alt="Upload preview"
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          src={displayUrl}
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isUploading && onRemove && (
          <Button
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              if (preview) {
                URL.revokeObjectURL(preview);
                setPreview(null);
              }
              onRemove();
            }}
            size="icon-xs"
            type="button"
            variant="destructive"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
        isDragActive && "border-primary bg-primary/5",
        isUploading && "pointer-events-none opacity-50",
        className
      )}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <Loader2 className="size-8 animate-spin" />
      ) : (
        <ImagePlus className="size-8" />
      )}
      <p className="text-center text-sm">
        {isDragActive
          ? "Drop image here"
          : "Drag & drop or click to upload"}
      </p>
      <p className="text-xs">PNG, JPG, WebP up to 2MB</p>
    </div>
  );
}
