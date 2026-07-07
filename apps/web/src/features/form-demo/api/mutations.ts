import { mutationOptions } from "@tanstack/react-query";

import { createProject, deleteProject, updateProject } from "./service";
// import { projectKeys } from "./queries";

export const createProjectMutationOptions = () =>
  mutationOptions({
    mutationFn: createProject,
  });

export const updateProjectMutationOptions = () =>
  mutationOptions({
    mutationFn: updateProject,
  });

export const deleteProjectMutationOptions = () =>
  mutationOptions({
    mutationFn: deleteProject,
  });
