import { MultipleSelector, type Option } from "#components/sumo/multi-select-pro";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

/**
 *
 * @Options
 *  label: string;
 *  description?: string;
 *  options: Option[];
 *  placeholder?: string;
 *  className?: string;
 *  required?: boolean;
 *  disabled?: boolean;
 *  // Limit the maximum number of selected options.
 *  maxSelected?: number;
 *  // When the number of selected options exceeds the limit, the onMaxSelected will be called.
 *  onMaxSelected?: (maxLimit: number) => void;
 *  // Hide the placeholder when there are options selected.
 *  hidePlaceholderWhenSelected?: boolean;
 *  //Group the options base on provided key.
 *  groupBy?: string;
 *  // Allow user to create option when there is no option matched.
 *  creatable?: boolean;
 *  // async search
 *  onSearch?: (value: string) => Promise<Option[]>;
 *  // sync search
 *  onSearchSync?: (value: string) => Option[];
 *  // Debounce time for async search. Only work with `onSearch`.
 *  delay?: number;
 *  // Trigger search when `onFocus`.
 *  triggerSearchOnFocus?: boolean;
 *  // Loading component.
 *  loadingIndicator?: React.ReactNode;
 *  // Empty component.
 *  emptyIndicator?: React.ReactNode;
 */

type MultiSelectFieldProps = Omit<
  React.ComponentProps<typeof MultipleSelector>,
  "onChange" | "children"
> &
  FieldControlProps;

export function MultiSelectProField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  options,
  // oxlint-disable-next-line no-unused-vars
  inputProps,
  ...props
}: MultiSelectFieldProps) {
  const field = useFieldContext<Option[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <MultipleSelector
        aria-invalid={isInvalid}
        inputProps={{
          // {...inputProps},
          onBlur: field.handleBlur,
          "aria-invalid": field.state.meta.errors.length > 0,
          "aria-describedby":
            field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined,
        }}
        onChange={(value) => field.handleChange(value)}
        options={options}
        value={field.state.value}
        // className={cn(
        //   "w-full",
        //   field.state.meta.errors.length > 0 &&
        //     "border-destructive focus-within:ring-destructive",
        // )}
        {...props}
      />
    </BaseField>
  );
}
