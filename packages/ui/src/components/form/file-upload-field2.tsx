/**
 * Source: https://github.com/studio-senkou/senkou-lentera-cendekia-dashboard-fe/blob/main/src/shared/ui/file-input.tsx
 */

import { useStore } from "@tanstack/react-form";
import { File, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "#components/shadcn/button";
import { Label } from "#components/shadcn/label";

import { useFieldContext } from "./context";

function ErrorMessages({ errors }: { errors: Array<string | { message: string }> }) {
  return (
    <>
      {errors.map((error) => (
        <div
          className="mt-1 text-sm text-red-500"
          key={typeof error === "string" ? error : error.message}
        >
          {typeof error === "string" ? error : error.message}
        </div>
      ))}
    </>
  );
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export function FileUploadField2({
  label,
  name,
  accept,
  multiple = false,
  required = false,
  maxSize,
  placeholder,
}: {
  label: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  maxSize?: number; // in bytes
  placeholder?: string;
}) {
  const field = useFieldContext<File | File[] | null>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFileSize = (file: File) => {
    if (maxSize && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      field.handleChange(multiple ? [] : null);
      return;
    }

    const fileArray = Array.from(files);

    // Validate file sizes
    for (const file of fileArray) {
      const sizeError = validateFileSize(file);
      if (sizeError) {
        // You might want to handle this error differently
        console.error(sizeError);
        return;
      }
    }

    if (multiple) {
      const currentFiles = (field.state.value as File[]) || [];
      field.handleChange([...currentFiles, ...fileArray]);
    } else {
      field.handleChange(fileArray[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const removeFile = (indexToRemove: number) => {
    if (multiple) {
      const currentFiles = (field.state.value as File[]) || [];
      const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
      field.handleChange(newFiles.length > 0 ? newFiles : []);
    } else {
      field.handleChange(null);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const currentFiles = multiple
    ? (field.state.value as File[]) || []
    : field.state.value
      ? [field.state.value as File]
      : [];

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1" htmlFor={name}>
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
        {maxSize != null && (
          <span className="ml-2 text-sm text-muted-foreground">
            (Max: {formatFileSize(maxSize)})
          </span>
        )}
      </Label>

      {/* Hidden file input */}
      <input
        accept={accept}
        className="hidden"
        id={name}
        multiple={multiple}
        name={name}
        onBlur={field.handleBlur}
        onChange={handleInputChange}
        ref={fileInputRef}
        required={required}
        type="file"
      />

      {/* Drop zone */}
      <button
        type="button"
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        } ${currentFiles.length > 0 ? "bg-muted/20" : "bg-background"} `}
        onClick={openFileDialog}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm text-muted-foreground">{placeholder}</p>
          <p className="text-xs text-muted-foreground">
            {accept && `Supported formats: ${accept}`}
          </p>
        </div>
      </button>

      {/* Selected files list */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected files:</Label>
          {currentFiles.map((file, index) => (
            <div
              className="flex items-center justify-between rounded-lg bg-muted p-3"
              key={file.name}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
