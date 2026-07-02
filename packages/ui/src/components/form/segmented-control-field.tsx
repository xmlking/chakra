import { type LucideIcon, Sun } from "lucide-react";
import type React from "react";

import { FieldDescription, FieldError, FieldLegend, FieldSet } from "#components/shadcn/field";
import * as SegmentedControl from "#components/sumo/segmented-control";

import type { FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

/**
 * Source: https://www.alignui.com/docs/v1.2/ui/segmented-control
 */

type RadioOption = {
  label: string;
  value: string;
  icon?: LucideIcon;
  // icon?: React.ComponentType<{ className?: string }>;
};

type SegmentedControlProps = React.ComponentProps<typeof SegmentedControl.Root> &
  FieldControlProps & {
    options: Readonly<RadioOption[]>;
  };

export function SegmentedControlField({ label, description, options }: SegmentedControlProps) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet>
      <FieldLegend>{label}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <SegmentedControl.Root
        aria-invalid={isInvalid}
        defaultValue="system"
        onValueChange={field.handleChange}
        value={field.state.value ?? undefined}
      >
        <SegmentedControl.List>
          {options.map((option) => (
            <SegmentedControl.Trigger key={option.label} value={option.value}>
              <Sun className="size-5 shrink-0" />
              {option.label}
            </SegmentedControl.Trigger>
          ))}
        </SegmentedControl.List>
      </SegmentedControl.Root>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
