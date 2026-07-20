import type { ZodIssue } from "zod";

export function parseZodIssues(message: string): ZodIssue[] | null {
  try {
    const parsed: unknown = JSON.parse(message);

    if (Array.isArray(parsed)) {
      return parsed as ZodIssue[];
    }

    return null;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyZodIssues(form: any, issues: readonly ZodIssue[]) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of issues) {
    const field = issue.path.join(".");
    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  for (const [field, errors] of Object.entries(fieldErrors)) {
    form.setFieldMeta(field as never, (meta: Record<string, unknown>) => {
      const errorMap =
        typeof meta.errorMap === "object" && meta.errorMap !== null
          ? (meta.errorMap as Record<string, unknown>)
          : {};
      return {
        ...meta,
        errors,
        errorMap: {
          ...errorMap,
          onSubmit: errors,
        },
      };
    });
  }
}
