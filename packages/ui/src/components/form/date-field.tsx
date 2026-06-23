import type { DateRange, DayPicker, Mode } from "@daypicker/react";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";

import { Button } from "#components/shadcn/button";
import { Calendar } from "#components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "#components/shadcn/popover";
import { Separator } from "#components/shadcn/separator";
import { cn } from "#lib/utils";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type DatePickerBaseProps = {
  mode?: Mode;
  disabled?: boolean;
  placeholder?: string;
} & Omit<React.ComponentProps<typeof DayPicker>, "selected" | "onSelect" | "mode" | "disabled">;

export type DatePickerSingleProps = {
  mode: "single";
  value?: Date;
} & DatePickerBaseProps;

type DatePickerRangeProps = {
  mode: "range";
  value?: DateRange;
} & DatePickerBaseProps;

type DatePickerMultipleProps = {
  mode: "multiple";
  value?: Date[];
} & DatePickerBaseProps;

export type DateFieldProps = DatePickerBaseProps &
  (DatePickerSingleProps | DatePickerRangeProps | DatePickerMultipleProps) &
  FieldControlProps;

export function DateField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  disabled,
  placeholder = "Pick a date",
  mode,
  ...props
}: DateFieldProps) {
  const field = useFieldContext<string | Date | DateRange | Date[] | undefined>();
  const [open, setOpen] = useState(false);

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Popover onOpenChange={setOpen} open={open && !disabled}>
        <PopoverTrigger
          render={
            <div className="relative">
              <Button
                className={cn(
                  "h-auto w-full justify-start text-start font-normal active:scale-none",
                  !field.state.value && "text-muted-foreground",
                )}
                disabled={disabled}
                type="button"
                variant="outline"
              >
                <CalendarIcon className="size-4" />
                {mode === "multiple" &&
                Array.isArray(field.state.value) &&
                field.state.value.length > 0 ? (
                  field.state.value.map((date: Date) => (
                    <div className="px-0.5" key={date.toLocaleDateString()}>
                      {date.toLocaleDateString()}
                    </div>
                  ))
                ) : mode === "range" &&
                  field.state.value &&
                  (field.state.value as DateRange)?.from ? (
                  <span>
                    {(field.state.value as DateRange).from instanceof Date
                      ? (field.state.value as DateRange).from?.toLocaleDateString()
                      : ""}
                    {(field.state.value as DateRange).to instanceof Date
                      ? `-${(field.state.value as DateRange).to?.toLocaleDateString()}`
                      : ""}
                  </span>
                ) : mode === "single" && field.state.value ? (
                  <span>
                    {field.state.value instanceof Date ? field.state.value.toLocaleDateString() : ""}
                  </span>
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
              {field.state.meta.isDirty && (
                <Button
                  className="absolute -end-0 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.form.resetField(field.name);
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <X />
                </Button>
              )}
            </div>
          }
        />
        <PopoverContent align="start" className="w-auto p-0">
          {mode === "single" && (
            <Calendar
              disabled={disabled}
              mode={mode}
              onSelect={(
                selected: Date | undefined,
                triggerDate: Date,
                modifiers: any,
                e: React.MouseEvent | React.KeyboardEvent,
              ) => {
                field.handleChange(selected);
                setOpen(false);
              }}
              selected={
                typeof field.state.value === "object" && field.state.value instanceof Date
                  ? field.state.value
                  : undefined
              }
              {...props}
            />
          )}
          {mode === "range" && (
            <>
              <Calendar
                disabled={disabled}
                mode={mode}
                numberOfMonths={2}
                onSelect={(
                  selected: DateRange | undefined,
                  triggerDate: Date,
                  modifiers: any,
                  e: React.MouseEvent | React.KeyboardEvent,
                ) => {
                  field.handleChange(selected);
                  // if(selected?.from && selected?.to) {
                  //   setOpen(false)
                  // }
                }}
                selected={
                  field.state.value &&
                  typeof field.state.value === "object" &&
                  "from" in field.state.value
                    ? (field.state.value as DateRange)
                    : undefined
                }
                {...props}
              />
              <Separator />
              <div className="ml-auto w-fit px-2 py-1.5">
                <Button onClick={() => setOpen(false)} size={"sm"} variant={"ghost"}>
                  OK
                </Button>
              </div>
            </>
          )}
          {mode === "multiple" && (
            <>
              <Calendar
                disabled={disabled}
                mode={mode}
                onSelect={(
                  selected: Date[] | undefined,
                  triggerDate: Date,
                  modifiers: any,
                  e: React.MouseEvent | React.KeyboardEvent,
                ) => {
                  field.handleChange(selected);
                }}
                selected={
                  Array.isArray(field.state.value) ? (field.state.value as Date[]) : undefined
                }
                {...props}
              />
              <Separator />
              <div className="ml-auto w-fit px-2 py-1.5">
                <Button onClick={() => setOpen(false)} size={"sm"} variant={"ghost"}>
                  OK
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </BaseField>
  );
}
