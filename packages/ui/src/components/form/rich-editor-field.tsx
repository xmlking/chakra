"use client";
import Placeholder from "@tiptap/extension-placeholder";
/**
 * TODO: https://www.shadcn.io/components/forms/editor
 * minimal-tiptap: https://github.com/Vedant-Panchal/MindSync/tree/main/frontend/src/components/minimal-tiptap
 * usage of minimal-tiptap: https://github.com/Vedant-Panchal/MindSync/blob/main/frontend/src/routes/(app)/app.create.tsx
 * Other: https://github.com/RovierrHQ/Rovierr/tree/main/packages/ui/src/components/rich-text-editor
 */
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Redo, Undo } from "lucide-react";
import { useEffect } from "react";

import { Button } from "#components/shadcn/button";

import { BaseField, type FieldControlProps } from "./base-field";
import { useFieldContext } from "./context";

interface RichEditorProps {
  defaultValue?: string | undefined;
  onSetText?: (text: string) => void;
  onSetJson?: (json: unknown) => void;
  onSetHtml?: (html: string) => void;
}

type RichEditorFieldProps = Omit<React.ComponentProps<typeof EditorContent>, "editor"> &
  FieldControlProps &
  RichEditorProps;

export function RichEditorField({
  description,
  classNames,
  label,
  tooltip,
  tooltipSide,
  placeholder = "",
}: RichEditorFieldProps & FieldControlProps) {
  const field = useFieldContext<string>();
  // oxlint-disable-next-line no-unused-vars
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // heading: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        // oxlint-disable-next-line react-doctor/no-event-handler
        placeholder,
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-base focus:outline-none text-foreground text-sm px-3 py-2.5 min-h-20",
      },
    },
    content: field.state.value || "<p></p>",
    immediatelyRender: false,

    onUpdate: ({ editor }) => field.handleChange(editor.getHTML()),
    // onUpdate: ({ editor }) => {
    //   const html = editor.getHTML();
    //   const sanitized = sanitizeHtml(html);
    //   field.handleChange(sanitized);
    // },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && field.state.value !== editor.getHTML()) {
      editor.commands.setContent(field.state.value);
    }
  }, [field.state.value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <BaseField
      classNames={classNames}
      description={description}
      label={label}
      tooltip={tooltip}
      tooltipSide={tooltipSide}
    >
      <div className="relative overflow-hidden rounded-lg border border-input bg-background focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20 focus-within:outline-none">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} onBlur={field.handleBlur} />
      </div>
    </BaseField>
  );
}

interface ToolbarProps {
  editor: Editor | null;
}

function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 border-b bg-muted/50 p-2">
      <Button
        aria-label="Bold"
        disabled={!editor.can().chain().focus().toggleBold().run()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        size="sm"
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        aria-label="Italic"
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        size="sm"
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        aria-label="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        size="sm"
        type="button"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        aria-label="Numbered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        size="sm"
        type="button"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      <Button
        aria-label="Undo"
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        aria-label="Redo"
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
