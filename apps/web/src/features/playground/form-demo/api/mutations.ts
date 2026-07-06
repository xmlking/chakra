import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProject, deleteProject, updateProject } from "./actions";
import { projectKeys } from "./queries";

interface MutationCallbacks {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onValidationError?: (errors: Record<string, string[]>) => void;
}

export function useCreateProject(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: async (data) => {
      if (!data.success && data.errors) {
        callbacks?.onValidationError?.(data.errors);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

export function useUpdateProject(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

export function useDeleteProject(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
