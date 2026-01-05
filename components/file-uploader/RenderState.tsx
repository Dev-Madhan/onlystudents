import {
  CloudUploadIcon,
  ImageIcon,
  Loader2,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/* =========================================================
   EMPTY STATE
   ========================================================= */

export function RenderEmptyState({
  isDragActive,
}: {
  isDragActive: boolean;
}) {
  return (
    <div className="text-center cursor-pointer">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground transition-colors",
            isDragActive && "text-primary"
          )}
        />
      </div>

      <p className="text-base font-semibold text-foreground">
        Drop your files or{" "}
        <span className="text-primary font-bold underline">
          click to upload
        </span>
      </p>

      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
}

/* =========================================================
   ERROR STATE
   ========================================================= */

export function RenderErrorState() {
  return (
    <div className="text-center cursor-default">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className="size-6 text-destructive" />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Something went wrong
      </p>

      <Button className="mt-4" type="button">
        Retry File Selection
      </Button>
    </div>
  );
}

/* =========================================================
   UPLOADED STATE (FIXED CURSOR ISSUE)
   ========================================================= */

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center justify-center cursor-default">
      {fileType === "video" ? (
        <video
          src={previewUrl}
          controls
          className="w-full h-full rounded-md cursor-default pointer-events-auto"
        />
      ) : (
        <Image
          src={previewUrl}
          alt="Uploaded File"
          fill
          className="object-contain p-2 cursor-default"
        />
      )}

      <Button
        variant="destructive"
        size="icon"
        className="absolute top-4 right-4 z-10"
        onClick={handleRemoveFile}
        disabled={isDeleting}
        type="button"
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

/* =========================================================
   UPLOADING STATE
   ========================================================= */

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center cursor-wait">
      <p className="text-lg font-semibold">{progress}%</p>

      <p className="mt-2 text-sm font-medium font-serif text-foreground">
        Uploading...
      </p>

      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
