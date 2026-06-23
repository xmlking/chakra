import type { DayPicker } from "@daypicker/react";
import { CalendarDays } from "lucide-react";
import React, { useCallback } from "react";

import { Button } from "#components/shadcn/button";
import { Calendar } from "#components/shadcn/calendar";
import { Input } from "#components/shadcn/input";
import { Popover, PopoverContent, PopoverTrigger } from "#components/shadcn/popover";
import { cn } from "#lib/utils";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

type DatePickerBaseProps = {
  disabled?: boolean;
  placeholder?: string;
} & Omit<React.ComponentProps<typeof DayPicker>, "selected" | "onSelect" | "mode">;

export type DatePickerSingleProps = { value?: Date } & DatePickerBaseProps;

export type DateTimeFieldProps = DatePickerSingleProps &
  FieldControlProps & {
    hideTime?: boolean;
  };

const isValidTimeComponent = (hours: number, minutes: number): boolean =>
  !(Number.isNaN(hours) || Number.isNaN(minutes)) &&
  hours >= 0 &&
  hours <= 23 &&
  minutes >= 0 &&
  minutes <= 59;

export function DateTimeField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  // oxlint-disable-next-line no-unused-vars
  disabled,
  placeholder,
  hideTime = false,
  ...props
}: DateTimeFieldProps) {
  // The `Field` infers that it should have a `value` type of `Date`
  const field = useFieldContext<Date | undefined>();
  const [open, setOpen] = React.useState(false);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const selectedDate = field.state.value;
  const defaultTime = "10:30";

  // oxlint-disable-next-line no-unused-vars
  const timeValue = selectedDate
    ? `${String(selectedDate.getHours()).padStart(2, "0")}:${String(
        selectedDate.getMinutes(),
      ).padStart(2, "0")}`
    : defaultTime;

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        // Preserve time if it exists
        if (selectedDate instanceof Date && !hideTime) {
          const newDate = new Date(date);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          field.handleChange(newDate);
        } else {
          field.handleChange(date);
        }
        setOpen(false);
      }
    },
    [field, hideTime, selectedDate],
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = e.target.value;

      const selectedDate = field.state.value;
      if (time && selectedDate) {
        const [hours, minutes] = time.split(":").map(Number);
        if (hours !== undefined && minutes !== undefined && isValidTimeComponent(hours, minutes)) {
          const newDate = new Date(selectedDate);
          newDate.setHours(hours, minutes, 0, 0);
          field.handleChange(newDate);
        }
      }
    },
    [field],
  );

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <div className="flex gap-4">
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger
            render={
              <Button
                className={cn(
                  "justify-between font-normal",
                  hideTime ? "w-full" : "w-[calc(100%-120px)]",
                  !selectedDate && "text-muted-foreground",
                )}
                id={field.name}
                variant="outline"
              >
                <span className="flex items-center">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US")
                    : (placeholder ?? "Select date")}
                </span>
                <CalendarDays className="ml-2 h-4 w-4" />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              captionLayout="dropdown"
              mode="single"
              onSelect={handleDateSelect}
              selected={selectedDate}
              {...props}
            />
          </PopoverContent>
        </Popover>

        {!hideTime && (
          <Input
            aria-invalid={isInvalid}
            className={cn(
              "w-[120px] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
              !selectedDate && "text-muted-foreground",
            )}
            defaultValue="10:30"
            onBlur={field.handleBlur}
            onChange={handleTimeChange}
            step="60"
            type="time"
            value={selectedDate ? selectedDate.toTimeString().slice(0, 5) : defaultTime}
          />
        )}
      </div>
    </BaseField>
  );
}
