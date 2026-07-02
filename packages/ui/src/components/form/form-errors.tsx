import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "#components/shadcn/alert";

import { useFormContext } from "./context";

type FieldError = {
  message: string;
  [key: string]: any;
};

export function FormErrors() {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.errors}>
      {(errors) => {
        if (!errors?.length) {
          return null;
        }

        // Flatten error messages
        const messages = Object.entries(errors[0] ?? {}).flatMap(([field, fieldErrors]) =>
          (fieldErrors as FieldError[]).map((err) => ({
            field,
            message: err.message,
          })),
        );

        if (messages.length === 0) {
          return null;
        }

        return (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="font-semibold">Form Errors</AlertTitle>
            <AlertDescription className="mt-1 space-y-1 text-sm text-red-700">
              <p>Please verify the following issues:</p>
              <ul className="list-inside list-disc text-sm">
                {messages.map((error, index) => (
                  <li key={index}>
                    {/* {error instanceof Error ? error.message : String(error)} */}
                    <strong>{error.field}:</strong> {error.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        );
      }}
    </form.Subscribe>
  );
}
