import { Rating } from "#components/reui/rating";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type RatingFieldProps = Omit<React.ComponentProps<typeof Rating>, "rating"> & FieldControlProps;

export function RatingField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  ...props
}: RatingFieldProps) {
  const field = useFieldContext<number>();

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Rating
        editable
        onBlur={field.handleBlur}
        onRatingChange={field.handleChange}
        rating={field.state.value ?? 0}
        {...props}
      />
    </BaseField>
  );
}
