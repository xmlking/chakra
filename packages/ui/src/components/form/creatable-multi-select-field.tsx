"use client";

import { PlusIcon } from "lucide-react";
import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPositioner,
  ComboboxValue,
} from "#components/basecn/combobox";
import { Button } from "#components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "#components/shadcn/dialog";
import { Input } from "#components/shadcn/input";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Internal marker used to render the "create" affordance. */
  creatable?: string;
}

type CreatableMultiSelectFieldProps = {
  /** Available options to select from. New items are appended when created. */
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** Allow creating new options that do not yet exist. Defaults to `true`. */
  creatable?: boolean;
  /** Maximum number of selected chips to show before collapsing behind a "+N more" toggle. */
  maxShownItems?: number;
} & FieldControlProps;

export function CreatableMultiSelectField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  options,
  placeholder = "e.g. bug",
  disabled = false,
  creatable = true,
  maxShownItems = 3,
}: CreatableMultiSelectFieldProps) {
  const field = useFieldContext<MultiSelectOption[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const [createdLabels, setCreatedLabels] = React.useState<MultiSelectOption[]>([]);
  const [query, setQuery] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const createInputRef = React.useRef<HTMLInputElement | null>(null);
  const comboboxInputRef = React.useRef<HTMLInputElement | null>(null);
  const pendingQueryRef = React.useRef("");

  const selected = field.state.value ?? [];

  const seenIds = new Set(options.map((o) => o.value));
  const labels = [...options, ...createdLabels.filter((l) => !seenIds.has(l.value))];

  function selectItem(item: MultiSelectOption) {
    if (!selected.some((i) => i.value === item.value)) {
      field.handleChange([...selected, item]);
    }
  }

  function handleCreate() {
    const input = createInputRef.current || comboboxInputRef.current;
    const value = input ? input.value.trim() : "";
    if (!value) {
      return;
    }

    const normalized = value.toLocaleLowerCase();
    const baseId = normalized.replace(/\s+/g, "-");
    const existing = labels.find((l) => l.value.trim().toLocaleLowerCase() === normalized);

    if (existing) {
      selectItem(existing);
      setOpenDialog(false);
      setQuery("");
      return;
    }

    const existingIds = new Set(labels.map((l) => l.value));
    let uniqueId = baseId;
    if (existingIds.has(uniqueId)) {
      let i = 2;
      while (existingIds.has(`${baseId}-${i}`)) {
        i += 1;
      }
      uniqueId = `${baseId}-${i}`;
    }

    const newItem: MultiSelectOption = { value: uniqueId, label };

    setCreatedLabels((prev) => [...prev, newItem]);
    selectItem(newItem);

    setOpenDialog(false);
    setQuery("");
  }

  function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleCreate();
  }

  const trimmed = query.trim();
  const lowered = trimmed.toLocaleLowerCase();
  const exactExists = labels.some((l) => l.value.trim().toLocaleLowerCase() === lowered);
  const itemsForView: MultiSelectOption[] =
    creatable && trimmed !== "" && !exactExists
      ? [
          ...labels,
          {
            creatable: trimmed,
            value: `create:${lowered}`,
            label: `Create "${trimmed}"`,
          },
        ]
      : labels;

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <Combobox
        disabled={disabled}
        inputValue={query}
        items={itemsForView}
        multiple
        onInputValueChange={setQuery}
        onOpenChange={(_open, details) => {
          if (!creatable) {
            return;
          }
          if ("key" in details.event && details.event.key === "Enter") {
            if (trimmed === "") {
              return;
            }

            const existing = labels.find((l) => l.value.trim().toLocaleLowerCase() === lowered);

            if (existing) {
              selectItem(existing);
              setQuery("");
              return;
            }

            pendingQueryRef.current = trimmed;
            setOpenDialog(true);
          }
        }}
        onValueChange={(items) => {
          const selectedItems = items as MultiSelectOption[];
          const last = selectedItems[selectedItems.length - 1];
          if (last && last.creatable) {
            pendingQueryRef.current = last.creatable;
            setOpenDialog(true);
            return;
          }
          const clean = selectedItems.filter((i) => !i.creatable);
          field.handleChange(clean);
          setQuery("");
        }}
        value={selected}
      >
        <ComboboxChips aria-invalid={isInvalid} className="w-full" ref={containerRef}>
          <ComboboxValue>
            {(value: MultiSelectOption[]) => {
              const visibleItems = expanded ? value : value.slice(0, maxShownItems);
              const hiddenCount = value.length - visibleItems.length;
              return (
                <React.Fragment>
                  {visibleItems.map((item) => (
                    <ComboboxChip key={item.value} aria-label={item.label}>
                      {item.label}
                      <ComboboxChipRemove />
                    </ComboboxChip>
                  ))}
                  {hiddenCount > 0 && !expanded && (
                    <ComboboxChip
                      className="cursor-pointer self-center px-1.5 text-muted-foreground"
                      onClick={() => setExpanded(true)}
                    >
                      +{hiddenCount} more
                    </ComboboxChip>
                  )}
                  {expanded && value.length > maxShownItems && (
                    <ComboboxChip
                      className="cursor-pointer self-center px-1.5 text-muted-foreground"
                      onClick={() => setExpanded(false)}
                    >
                      Show less
                    </ComboboxChip>
                  )}
                  <ComboboxInput
                    className="h-6 flex-1 border-0 bg-transparent pl-2 text-base shadow-none outline-none focus-visible:ring-0"
                    id={field.name}
                    onBlur={field.handleBlur}
                    placeholder={value.length > 0 ? "" : placeholder}
                    ref={comboboxInputRef}
                  />
                </React.Fragment>
              );
            }}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxPositioner anchor={containerRef} className="z-50 outline-none" sideOffset={4}>
          <ComboboxPopup>
            <ComboboxEmpty>No results found.</ComboboxEmpty>
            <ComboboxList>
              {(item: MultiSelectOption) =>
                item.creatable ? (
                  <ComboboxItem key={item.value} value={item} disabled={item.disabled}>
                    <span className="col-start-1">
                      <PlusIcon className="size-3" />
                    </span>
                    <div className="col-start-2">Create &quot;{item.creatable}&quot;</div>
                  </ComboboxItem>
                ) : (
                  <ComboboxItem key={item.value} value={item}>
                    <ComboboxItemIndicator />
                    <div className="col-start-2">{item.label}</div>
                  </ComboboxItem>
                )
              }
            </ComboboxList>
          </ComboboxPopup>
        </ComboboxPositioner>
      </Combobox>

      <Dialog onOpenChange={setOpenDialog} open={openDialog}>
        <DialogContent initialFocus={createInputRef}>
          <DialogTitle>Create new label</DialogTitle>
          <DialogDescription>Add a new label to select.</DialogDescription>
          <form onSubmit={handleCreateSubmit}>
            <Input
              defaultValue={pendingQueryRef.current}
              placeholder="Label name"
              ref={createInputRef}
            />
            <div className="mt-4 flex justify-end gap-4">
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </BaseField>
  );
}
