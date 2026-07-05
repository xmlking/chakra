"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "#components/shadcn/avatar";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "#components/shadcn/combobox";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

export interface MultiSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  image?: string | null;
  disabled?: boolean;
}

type MultiSelectFieldProps = {
  options: MultiSelectOption[];
  placeholder?: string;
  maxShownItems?: number;
  disabled?: boolean;
} & FieldControlProps;

export function MultiSelectField({
  label,
  description,
  classNames,
  options,
  disabled = false,
  tooltip,
  tooltipSide,
  placeholder = "Select items...",
  maxShownItems = 3,
}: MultiSelectFieldProps) {
  const field = useFieldContext<string[]>();
  const anchor = useComboboxAnchor();
  const [expanded, setExpanded] = useState(false);

  const selectedValues = field.state.value ?? [];
  const selectedOptions = selectedValues.flatMap((v) => {
    const option = options.find((o) => o.value === v);
    return option ? [option] : [];
  });

  const visibleItems = expanded ? selectedOptions : selectedOptions.slice(0, maxShownItems);
  const hiddenCount = selectedOptions.length - visibleItems.length;

  const handleSelect = (option: MultiSelectOption) => {
    const newValues = selectedValues.includes(option.value)
      ? selectedValues.filter((v) => v !== option.value)
      : [...selectedValues, option.value];
    field.handleChange(newValues);
  };

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Combobox
        multiple
        items={options}
        itemToStringValue={(option: MultiSelectOption) => option.label}
        disabled={disabled}
      >
        <ComboboxChips ref={anchor} className="has-data-[slot=combobox-chip]:pl-1">
          <ComboboxValue>
            {() => (
              <>
                {visibleItems.map((option) => (
                  <ComboboxChip key={option.value} showRemove={true} className="gap-1.5">
                    {option.image && (
                      <Avatar className="size-4">
                        <AvatarImage
                          alt={option.label}
                          src={option.image || "/avatars/placeholder.svg"}
                        />
                        <AvatarFallback className="text-xs">{option.label[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <span>{option.label}</span>
                  </ComboboxChip>
                ))}
                {hiddenCount > 0 && !expanded && (
                  <ComboboxChip
                    className="cursor-pointer px-1.5 text-muted-foreground"
                    onClick={() => setExpanded(true)}
                  >
                    +{hiddenCount} more
                  </ComboboxChip>
                )}
                {expanded && hiddenCount > 0 && (
                  <ComboboxChip
                    className="cursor-pointer px-1.5 text-muted-foreground"
                    onClick={() => setExpanded(false)}
                  >
                    Show less
                  </ComboboxChip>
                )}
                <ComboboxChipsInput placeholder={placeholder} />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor} className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxList>
            {(option: MultiSelectOption) => (
              <ComboboxItem
                key={option.value}
                value={option}
                disabled={option.disabled}
                onSelect={() => handleSelect(option)}
              >
                <div className="flex items-center gap-2">
                  {option.image && (
                    <Avatar className="size-7">
                      <AvatarImage src={option.image || "/avatars/placeholder.svg"} />
                      <AvatarFallback>{option.label[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col items-start gap-px">
                    <span className="font-medium">{option.label}</span>
                    {option.subLabel && (
                      <small className="text-sm text-muted-foreground">{option.subLabel}</small>
                    )}
                  </div>
                </div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </BaseField>
  );
}
