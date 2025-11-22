"use client";

import {FileRejection, useDropzone} from "react-dropzone";
import {useCallback, useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {
    RenderEmptyState,
    RenderErrorState, RenderUploadedState, RenderUploadingState,
} from "@/components/file-uploader/RenderState";
import {toast} from "sonner";
import {v4 as uuidv4} from "uuid";

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video";
}

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
}

export default function Uploader({onChange, value}: iAppProps) {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
        key: value,
    });

    // -------------------------------
    // Upload to S3
    // -------------------------------
    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

        try {
            // 1. Get presigned upload URL
            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            });

            if (!presignedResponse.ok) {
                toast.error("Failed to get upload URL.");
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));
                return;
            }

            // 👇 MUST MATCH BACKEND EXACTLY
            const {presignedUrl, key} = await presignedResponse.json();

            if (!presignedUrl || !key) {
                toast.error("Invalid URL response from server.");
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));
                return;
            }

            // 2. Upload File using XHR for progress
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / event.total) * 100;

                        setFileState((prev) => ({
                            ...prev,
                            progress: Math.round(percent),
                        }));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 100,
                            key: key, // Store uploaded S3 key
                        }));

                        onChange?.(key);

                        toast.success("File uploaded successfully.");
                        resolve();
                    } else {
                        reject(new Error("Upload failed"));
                    }
                };

                xhr.onerror = () => reject(new Error("Upload error"));

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong during upload.");

            setFileState((prev) => ({
                ...prev,
                progress: 0,
                uploading: false,
                error: true,
            }));
        }
    }

    // -------------------------------
    // When file is dropped
    // -------------------------------
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            setFileState({
                file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: "image",
            });

            uploadFile(file);
        }
    }, [fileState.objectUrl, setFileState, uploadFile]);

    async function handleRemoveFile() {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState((prev) => ({
                ...prev,
                isDeleting: true,
            }));

            const response = await fetch("/api/s3/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: fileState.key
                }),
            });

            if (!response.ok) {
                toast.error("Failed to remove file from storage..");

                setFileState((prev) => ({
                    ...prev,
                    isDeleting: true,
                    error: true,
                }));

                return;
            }
            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            onChange?.("");

            setFileState(() => ({
                file: null,
                uploading: false,
                progress: 0,
                objectUrl: undefined,
                error:false,
                fileType: "image",
                id: null,
                isDeleting: false,
            }));

            toast.success("File removed successfully.");
        } catch {
            toast.error("Error removing file. please try again later.");

            setFileState((prev) => ({
               ...prev,
                isDeleting: false,
                error: true,
            }));
        }
    }

    // -------------------------------
    // Rejected files handler
    // -------------------------------
    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find(
                (r) => r.errors[0].code === "too-many-files"
            );
            const fileSizeTooBig = fileRejection.find(
                (r) => r.errors[0].code === "file-too-large"
            );

            if (fileSizeTooBig) {
                toast.error("File is too large. Max 5MB allowed.");
            }
            if (tooManyFiles) {
                toast.error("Only 1 file can be uploaded.");
            }
        }
    }

    // -------------------------------
    // Render Logic
    // -------------------------------
    function renderContent() {
        if (fileState.uploading) return (
            <RenderUploadingState progress={fileState.progress} file={fileState.file as File}/>
        );

        if (fileState.error) return <RenderErrorState/>;

        if (fileState.objectUrl) return (
            <RenderUploadedState handleRemoveFile={handleRemoveFile} isDeleting={fileState.isDeleting} previewUrl={fileState.objectUrl}/>
        );

        return <RenderEmptyState isDragActive={isDragActive}/>;
    }

    useEffect(() => {
        return () => {
            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        };
    }, [fileState.objectUrl]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {"image/*": []},
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024,
        onDropRejected: rejectedFiles,
        disabled: fileState.uploading || !!fileState.objectUrl,
    });

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed transition-colors duration-200 w-full h-64",
                isDragActive
                    ? "border-primary bg-primary/10 border-solid"
                    : "border-border hover:border-primary"
            )}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4 font-serif">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
}
``