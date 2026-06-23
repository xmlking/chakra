import { type Tag, TagInput, type TagInputProps } from "emblor";
import { type Dispatch, type SetStateAction, useState } from "react";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

/**
 * Source: https://github.com/JaleelB/emblor
 * Source: https://github.com/JaleelB/emblor/issues/108
 * Docs: https://emblor.jaleelbennett.com/introduction#setup
 */

type TagFieldProps = Omit<
  TagInputProps,
  "activeTagIndex" | "setActiveTagIndex" | "tags" | "setTags" | "autocompleteOptions"
> &
  FieldControlProps & {
    autocompleteOptions?: string[];
  };

export function TagField({
  label,
  description,
  classNames,
  tooltip,
  tooltipSide,
  autocompleteOptions,
  ...props
}: TagFieldProps) {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  // Convert string[] to Tag[] format
  const tags: Tag[] = field.state.value
    ? field.state.value.map((text) => ({
        id: text,
        text,
      }))
    : [];

  const autocompleteTags: Tag[] | undefined = autocompleteOptions?.map((text) => ({
    id: text,
    text,
  }));

  const handleTagsChange: Dispatch<SetStateAction<Tag[]>> = (newTagsOrUpdater) => {
    const newTags =
      typeof newTagsOrUpdater === "function" ? newTagsOrUpdater(tags) : newTagsOrUpdater;

    field.handleChange(newTags.map((tag) => tag.text));
  };

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <TagInput
        activeTagIndex={activeTagIndex}
        aria-invalid={isInvalid}
        autocompleteOptions={autocompleteTags}
        id={field.name}
        name={field.name}
        // onBlur={field.handleBlur}
        setActiveTagIndex={setActiveTagIndex}
        setTags={handleTagsChange}
        styleClasses={{
          inlineTagsContainer:
            "border-input rounded-md dark:bg-input/30 shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1.5",
          input: "w-full min-w-[80px] shadow-none px-2 h-7",
          tag: {
            body: "h-7 relative bg-input/60 border border-input hover:bg-secondary rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
          },
        }}
        tags={tags ?? []}
        {...props}
      />
    </BaseField>
  );
}
