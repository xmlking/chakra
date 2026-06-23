import { FileUpload } from "#components/sumo/file-upload";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type FileUploadProps = Omit<React.ComponentProps<typeof FileUpload>, "name" | "setValue"> &
  FieldControlProps;

export function FileUploadField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: FileUploadProps) {
  const field = useFieldContext<File | File[] | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <FileUpload
        aria-invalid={isInvalid}
        name={field.name}
        setValue={(name, value, options) => {
          console.debug({ name, value, options });
          field.handleChange(value);
        }}
        {...props}
      />
    </BaseField>
  );
}
