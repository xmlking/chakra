"use client";

/**
 * Source: https://github.com/Ali-Hussein-dev/formcn/blob/main/apps/web/src/components/form-fields/file-upload.tsx
 */

import { AlertCircleIcon, CloudUpload, File, XIcon } from "lucide-react";

import { Button } from "#components/shadcn/button";
import { formatBytes, useFileUpload } from "#hooks/use-file-upload";

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file.type;
  if (fileType.startsWith("image/")) {
    // return preview
    return (
      <div className="aspect-square size-10 overflow-hidden rounded-md">
        <img alt="upload" className="object-fill" src={URL.createObjectURL(file.file as Blob)} />
      </div>
    );
  }
  return (
    <div className="flex aspect-square size-10 items-center justify-center overflow-hidden rounded-full">
      <File className="size-5 opacity-60" />
    </div>
  );
};

export function FileUpload({
  maxFiles,
  maxSize,
  placeholder,
  // description,
  required,
  setValue,
  accept,
  name,
  disabled,
}: {
  maxFiles: number;
  maxSize: number;
  placeholder?: string;
  // description?: string;
  required?: boolean;
  disabled?: boolean;
  setValue: (
    name: string,
    value: any,
    options?: {
      shouldValidate?: boolean;
      shouldDirty?: boolean;
      shouldTouch?: boolean;
    },
  ) => void;
  accept?: string;
  name: string;
}) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: maxFiles > 1,
    maxFiles,
    maxSize,
    accept,
    onFilesChange: (files) => {
      setValue(
        name,
        files.map((file) => file.file),
        { shouldValidate: true, shouldDirty: true, shouldTouch: true },
      );
    },
  });

  return (
    <div className="flex flex-col gap-2 pb-2">
      {/* Drop area */}
      <button
        className="flex min-h-32 flex-col items-center justify-center rounded-md border border-dashed border-input p-4 transition-colors hover:cursor-pointer hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        type="button"
      >
        <input
          {...getInputProps()}
          aria-label="Upload files"
          className="sr-only"
          disabled={disabled}
          required={required}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-secondary"
          >
            <CloudUpload className="size-4 opacity-60" />
          </div>
          {/* <p className="mb-1.5 text-sm font-medium">
            Upload
          </p> */}
          <p className="mb-2 text-sm font-medium text-foreground">Drag & drop or click to browse</p>
          <div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground/70">
            {placeholder}
          </div>
        </div>
      </button>

      {errors.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-destructive" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              className="flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
              key={file.id}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                {getFileIcon(file)}
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="max-w-[200px] truncate text-[11px] font-medium">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.file.size)}</p>
                </div>
              </div>

              <Button
                aria-label="Remove file"
                className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                onClick={() => removeFile(file.id)}
                size="icon"
                variant="ghost"
              >
                <XIcon aria-hidden="true" className="size-4" />
              </Button>
            </div>
          ))}

          {/* Remove all files button */}
          {files.length > 1 && (
            <div className="flex justify-end">
              <Button onClick={clearFiles} size="sm" variant="outline">
                Remove all files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
