// oxlint-disable react-doctor/no-impure-state-updater
"use client";

import type React from "react";
/**
 * Source: https://github.com/Ali-Hussein-dev/formcn/blob/main/apps/web/src/form-builder/hooks/use-file-upload.tsx
 * Docs: https://github.com/Ali-Hussein-dev/formcn
 */
import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useRef,
  useState,
} from "react";

export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

export type FileWithPreview = {
  file: File | FileMetadata;
  id: string;
  preview?: string;
};

export type FileUploadOptions = {
  maxFiles?: number; // Only used when multiple is true, defaults to Infinity
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean; // Defaults to false
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void; // Callback when files change
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void; // Callback when new files are added
};

export type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
};

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>,
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
};

const createPreview = (file: File | FileMetadata): string | undefined => {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  return file.url;
};

const generateUniqueId = (file: File | FileMetadata): string => {
  if (file instanceof File) {
    return `${file.name}-${crypto.randomUUID()}`;
  }
  return file.id;
};

const handleDragOver = (e: DragEvent<HTMLElement>) => {
  e.preventDefault();
  e.stopPropagation();
};

export const useFileUpload = (
  options: FileUploadOptions = {},
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = Number.POSITIVE_INFINITY,
    accept = "*",
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
    errors: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const clearFiles = () => {
    setState((prev) => {
      // Clean up object URLs
      for (const file of prev.files) {
        if (file.preview && file.file instanceof File && file.file.type.startsWith("image/")) {
          URL.revokeObjectURL(file.preview);
        }
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      };

      onFilesChange?.(newState.files);
      return newState;
    });
  };

  const addFiles = (newFiles: FileList | File[]) => {
    if (!newFiles || newFiles.length === 0) {
      return;
    }

    const newFilesArray = Array.from(newFiles);
    const errors: string[] = [];

    // Clear existing errors when new files are uploaded
    setState((prev) => ({ ...prev, errors: [] }));

    // In single file mode, clear existing files first
    if (!multiple) {
      clearFiles();
    }

    // Check if adding these files would exceed maxFiles (only in multiple mode)
    if (
      multiple &&
      maxFiles !== Number.POSITIVE_INFINITY &&
      state.files.length + newFilesArray.length > maxFiles
    ) {
      errors.push(`You can only upload a maximum of ${maxFiles} files.`);
      setState((prev) => ({ ...prev, errors }));
      return;
    }

    const validFiles: FileWithPreview[] = [];

    for (const file of newFilesArray) {
      // Only check for duplicates if multiple files are allowed
      if (multiple) {
        const isDuplicate = state.files.some(
          (existingFile) =>
            existingFile.file.name === file.name && existingFile.file.size === file.size,
        );

        // Skip duplicate files silently
        if (isDuplicate) {
          return;
        }
      }

      validFiles.push({
        file,
        id: generateUniqueId(file),
        preview: createPreview(file),
      });
    }

    // Only update state if we have valid files to add
    if (validFiles.length > 0) {
      // Call the onFilesAdded callback with the newly added valid files
      onFilesAdded?.(validFiles);

      setState((prev) => {
        const newFiles = multiple ? [...prev.files, ...validFiles] : validFiles;
        onFilesChange?.(newFiles);
        return {
          ...prev,
          files: newFiles,
          errors,
        };
      });
    } else if (errors.length > 0) {
      setState((prev) => ({
        ...prev,
        errors,
      }));
    }

    // Reset input value after handling files
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setState((prev) => {
      const fileToRemove = prev.files.find((file) => file.id === id);
      if (
        fileToRemove &&
        fileToRemove.preview &&
        fileToRemove.file instanceof File &&
        fileToRemove.file.type.startsWith("image/")
      ) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const newFiles = prev.files.filter((file) => file.id !== id);
      onFilesChange?.(newFiles);

      return {
        ...prev,
        files: newFiles,
        errors: [],
      };
    });
  };

  const clearErrors = () => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }));
  };

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setState((prev) => ({ ...prev, isDragging: false }));
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));

    // Don't process files if the input is disabled
    if (inputRef.current?.disabled) {
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // In single file mode, only use the first file
      if (multiple) {
        addFiles(e.dataTransfer.files);
      } else {
        const file = e.dataTransfer.files[0];
        addFiles([file]);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getInputProps = (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
    ...props,
    type: "file" as const,
    onChange: handleFileChange,
    accept: props.accept || accept,
    multiple: props.multiple !== undefined ? props.multiple : multiple,
    ref: inputRef,
  });

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};

// Helper function to format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / k ** i).toFixed(dm)) + sizes[i];
};
