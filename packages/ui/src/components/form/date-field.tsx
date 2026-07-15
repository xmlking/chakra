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
          nativeButton={false}
          render={
            <div className="relative flex h-auto w-full">
              <button
                className={cn(
                  "flex flex-1 items-center justify-start gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-start text-sm shadow-sm transition-colors placeholder:text-muted-foreground hover:bg-accent focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  !field.state.value && "text-muted-foreground",
                )}
                disabled={disabled}
                type="button"
              >
                <CalendarIcon className="size-4" />
                <span>
                  {mode === "multiple" &&
                  Array.isArray(field.state.value) &&
                  field.state.value.length > 0 ? (
                    field.state.value.map((date: Date) => (
                      <span className="px-0.5" key={date.toLocaleDateString()}>
                        {date.toLocaleDateString()}
                      </span>
                    ))
                  ) : mode === "range" &&
                    field.state.value &&
                    (field.state.value as DateRange)?.from ? (
                    <>
                      {(field.state.value as DateRange).from instanceof Date
                        ? (field.state.value as DateRange).from?.toLocaleDateString()
                        : ""}
                      {(field.state.value as DateRange).to instanceof Date
                        ? `-${(field.state.value as DateRange).to?.toLocaleDateString()}`
                        : ""}
                    </>
                  ) : mode === "single" && field.state.value ? (
                    <>
                      {field.state.value instanceof Date
                        ? field.state.value.toLocaleDateString()
                        : ""}
                    </>
                  ) : (
                    placeholder
                  )}
                </span>
              </button>
              {field.state.meta.isDirty && (
                <button
                  className="absolute -end-0 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted-foreground/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.form.resetField(field.name);
                  }}
                  type="button"
                  aria-label="Clear date"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          }
        />
        <PopoverContent align="start" className="w-auto p-0">
          {mode === "single" && (
            <>
              <Calendar
                disabled={disabled}
                mode={mode}
                onSelect={(selected: Date | undefined) => {
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
              <Separator />
              <div className="ml-auto w-fit px-2 py-1.5">
                <Button onClick={() => setOpen(false)} size={"sm"} variant={"ghost"}>
                  OK
                </Button>
              </div>
            </>
          )}
          {mode === "range" && (
            <>
              <Calendar
                disabled={disabled}
                mode={mode}
                numberOfMonths={2}
                onSelect={(selected: DateRange | undefined) => {
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
                onSelect={(selected: Date[] | undefined) => {
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
