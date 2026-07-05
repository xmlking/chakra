"use client";

import { Avatar, AvatarFallback, AvatarImage } from "#components/shadcn/avatar";
import { Button } from "#components/shadcn/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "#components/shadcn/combobox";
import { Item, ItemContent, ItemDescription, ItemTitle } from "#components/shadcn/item";

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

  const selectedValue = field.state.value ?? "";
  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Combobox
        items={options}
        defaultValue={selectedOption}
        itemToStringValue={(option: SingleSelectOption) => option.label}
        disabled={disabled}
        onValueChange={(option) => {
          field.handleChange(option?.value ?? "");
        }}
      >
        <ComboboxTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
              disabled={disabled}
            />
          }
        >
          <ComboboxValue>
            {(option: SingleSelectOption | null) =>
              option ? (
                <span className="flex items-center gap-2">
                  {option.image && (
                    <Avatar className="size-5">
                      <AvatarImage src={option.image} alt={option.label} />
                      <AvatarFallback>{option.label[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <span>{option.label}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput placeholder="Search..." />
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxList>
            {(option) => (
              <ComboboxItem key={option.value} value={option} disabled={option.disabled}>
                <Item size="xs" className="p-0">
                  {option.image && (
                    <Avatar className="size-6">
                      <AvatarImage src={option.image} alt={option.label} />
                      <AvatarFallback>{option.label[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">{option.label}</ItemTitle>
                    {option.subLabel && <ItemDescription>{option.subLabel}</ItemDescription>}
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </BaseField>
  );
}
