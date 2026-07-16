import type { FilesError } from "files-sdk";

export interface ErrorMessage {
  title: string;
  message: string;
}

export function getErrorMessage(error: unknown): ErrorMessage {
  if (error instanceof Error) {
    const filesError = error as FilesError & { code?: string };

    if (filesError.code === "NotFound") {
      return {
        title: "File Not Found",
        message: "The file was deleted or no longer exists. Refresh to see current files.",
      };
    }

    if (filesError.code === "Unauthorized") {
      return {
        title: "Access Denied",
        message: "You don't have permission to perform this action.",
      };
    }

    if (filesError.code === "Conflict") {
      return {
        title: "File Already Exists",
        message: "A file with this name already exists in this folder.",
      };
    }

    if (filesError.code === "ReadOnly") {
      return {
        title: "Read-Only Storage",
        message: "This storage is read-only and doesn't allow modifications.",
      };
    }

    if (filesError.code === "Provider") {
      return {
        title: "Storage Error",
        message: "A storage error occurred. Please try again.",
      };
    }

    return {
      title: "Error",
      message: error.message || "An unexpected error occurred.",
    };
  }

  return {
    title: "Error",
    message: "An unexpected error occurred. Please try again.",
  };
}
