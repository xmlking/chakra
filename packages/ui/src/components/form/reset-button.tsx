import { Button } from "#components/shadcn/button";

import { useFormContext } from "./context";

export function ResetButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.isDirty, state.isSubmitting]}>
      {([isDirty, isSubmitting]) => (
        <Button
          disabled={!isDirty || isSubmitting}
          onClick={() => form.reset()}
          type="reset"
          variant="outline"
          {...props}
        >
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}
