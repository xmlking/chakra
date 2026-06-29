"use client";

import { CheckIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Badge } from "#components/reui/badge";
/**
 * Ref: https://reui.io/docs/combobox
 */
import { Avatar, AvatarFallback, AvatarImage } from "#components/shadcn/avatar";
import { Button } from "#components/shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "#components/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "#components/shadcn/popover";
import { ScrollArea } from "#components/shadcn/scroll-area";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

export interface SingleSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  image?: string | null;
  disabled?: boolean;
}

type SingleSelectFieldProps = {
  options: SingleSelectOption[];
  placeholder?: string;
  disabled?: boolean;
} & FieldControlProps;

export function SingleSelectField({
  label,
  description,
  classNames,
  options,
  disabled = false,
  tooltip,
  tooltipSide,
  placeholder = "Select items...",
}: SingleSelectFieldProps) {
  const field = useFieldContext<string>();

  const [open, setOpen] = useState(false);

  const selectedValue = field.state.value ?? undefined;

  const toggle = (selectedValue: string) => {
    if (field.state.value === selectedValue) {
      field.handleChange("");
    } else {
      field.handleChange(selectedValue);
    }
    setOpen(false);
    return;
  };

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <Button
              aria-expanded={open}
              autoHeight={true}
              className="relative w-full p-1"
              disabled={disabled}
              mode="input"
              role="combobox"
              variant="outline"
            >
              <div className="flex flex-wrap items-center gap-1 pe-2.5">
                {selectedValue?.length ? (
                  options
                    .filter((o) => o.value === selectedValue)
                    .map((option) => (
                      <Badge className="gap-1.5" key={option.value} variant="outline">
                        {option.image && (
                          <Avatar className="size-4">
                            <AvatarImage
                              alt={option.label}
                              src={option.image || "/avatars/placeholder.svg"}
                            />
                            <AvatarFallback className="text-xs">{option.label[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="font-medium">{option.label}</span>
                      </Badge>
                    ))
                ) : (
                  <span className="px-2.5 text-muted-foreground">{placeholder}</span>
                )}
              </div>

              <ChevronDown className="absolute end-3 top-2" />
            </Button>
          }
        />

        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      disabled={option.disabled}
                      key={option.value}
                      onSelect={() => toggle(option.value)}
                      value={option.label}
                    >
                      <span className="flex items-center gap-2">
                        {option.image && (
                          <Avatar className="size-7">
                            <AvatarImage src={option.image || "/avatars/placeholder.svg"} />
                            <AvatarFallback>{option.label[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="flex flex-col items-start gap-px">
                          <span className="font-medium">{option.label}</span>
                          {option.subLabel && (
                            <small className="text-sm text-muted-foreground">
                              {option.subLabel}
                            </small>
                          )}
                        </span>
                      </span>
                      {selectedValue === option.value && !option.disabled && <CheckIcon />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </BaseField>
  );
}
