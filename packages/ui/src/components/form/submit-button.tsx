import { Button } from "#components/shadcn/button";
import { Spinner } from "#components/shadcn/spinner";

import { useFormContext } from "./context";

export function SubmitButton({
  isExecuting = false,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { isExecuting?: boolean }) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          disabled={!canSubmit || isExecuting || isSubmitting}
          form={form.formId}
          type="submit"
          {...props}
        >
          {(isExecuting || isSubmitting) && <Spinner />}
          <span>{children}</span>
        </Button>
      )}
    </form.Subscribe>
  );
}
