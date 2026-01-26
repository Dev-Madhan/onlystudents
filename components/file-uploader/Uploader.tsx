"use client";

import {useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "@/components/file-uploader/RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct-url";

/* =========================================================
   TYPES
   ========================================================= */

type FileTypeAccepted = "image" | "video" | "demoVideo";

/** What RenderUploadedState actually understands */
type RenderFileType = "image" | "video";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: FileTypeAccepted;
}

interface UploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted?: FileTypeAccepted;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

const MAX_SIZES: Record<FileTypeAccepted, number> = {
  image: 5 * 1024 * 1024, // 5MB
  video: 5 * 1024 * 1024 * 1024, // 5GB
  demoVideo: 2 * 1024 * 1024 * 1024, // 2GB
};

/* =========================================================
   HELPERS
   ========================================================= */

/** Map demoVideo → video for preview components */
const toRenderFileType = (type: FileTypeAccepted): RenderFileType =>
  type === "image" ? "image" : "video";

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Uploader({
  value,
  onChange,
  fileTypeAccepted = "image",
}: UploaderProps) {
  const remoteUrl = value ? useConstructUrl(value) : undefined;

  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    key: value,
    isDeleting: false,
    error: false,
    objectUrl: remoteUrl,
    fileType: fileTypeAccepted,
  });

  /* =========================================================
     UPLOAD
     ========================================================= */

  const uploadFile = useCallback(
    async (file: File): Promise<void> => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
        error: false,
      }));

      const response = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: fileTypeAccepted === "image",
        }),
      });

      if (!response.ok) {
        toast.error("Failed to get upload URL");
        setFileState((prev) => ({ ...prev, uploading: false, error: true }));
        return;
      }

      const { presignedUrl, key } = (await response.json()) as {
        presignedUrl?: string;
        key?: string;
      };

      if (!presignedUrl || !key) {
        toast.error("Invalid upload response");
        setFileState((prev) => ({ ...prev, uploading: false, error: true }));
        return;
      }

      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setFileState((prev) => ({
              ...prev,
              progress: Math.round((event.loaded / event.total) * 100),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              key,
            }));
            onChange?.(key);
            toast.success("File uploaded successfully");
          } else {
            toast.error("Upload failed");
            setFileState((prev) => ({ ...prev, uploading: false, error: true }));
          }
          resolve();
        };

        xhr.onerror = () => {
          toast.error("Upload error");
          setFileState((prev) => ({ ...prev, uploading: false, error: true }));
          resolve();
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    },
    [fileTypeAccepted, onChange]
  );

  /* =========================================================
     DROP
     ========================================================= */

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      if (fileState.objectUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      const previewUrl = URL.createObjectURL(file);

      setFileState({
        id: uuidv4(),
        file,
        uploading: false,
        progress: 0,
        objectUrl: previewUrl,
        error: false,
        isDeleting: false,
        fileType: fileTypeAccepted,
      });

      await uploadFile(file);
    },
    [fileState.objectUrl, uploadFile, fileTypeAccepted]
  );

  /* =========================================================
     DELETE
     ========================================================= */

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.key) return;

    setFileState((prev) => ({ ...prev, isDeleting: true }));

    const response = await fetch("/api/s3/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: fileState.key }),
    });

    if (!response.ok) {
      toast.error("Failed to remove file");
      setFileState((prev) => ({ ...prev, isDeleting: false, error: true }));
      return;
    }

    if (fileState.objectUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(fileState.objectUrl);
    }

    onChange?.("");

    setFileState({
      id: null,
      file: null,
      uploading: false,
      progress: 0,
      objectUrl: undefined,
      error: false,
      isDeleting: false,
      fileType: fileTypeAccepted,
    });

    toast.success("File removed successfully");
  };

  /* =========================================================
     DROPZONE
     ========================================================= */

  const isVideo =
    fileTypeAccepted === "video" || fileTypeAccepted === "demoVideo";

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: isVideo ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    maxSize: MAX_SIZES[fileTypeAccepted],
    disabled: fileState.uploading || fileState.isDeleting,
  });

  /* =========================================================
     RENDER
     ========================================================= */

  const renderContent = () => {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }

    if (fileState.error) return <RenderErrorState />;

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          fileType={toRenderFileType(fileState.fileType)} // ✅ FIX
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed w-full h-64 transition-colors",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
