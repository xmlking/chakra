import { useFieldContext } from "./context";

export function HiddenField() {
  const field = useFieldContext<string>();

  return (
    <input
      className="hidden"
      id={field.name}
      name={field.name}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
      type="hidden"
      value={field.state.value ?? undefined}
    />
  );
}
