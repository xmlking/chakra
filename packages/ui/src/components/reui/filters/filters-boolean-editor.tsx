import { cn } from "cn"
import { Label } from "#components/shadcn/label"
import { Switch } from "#components/shadcn/switch"
import type { FilterEditorProps } from "#components/reui/filters/filters-types"

export function BooleanSwitchFilterEditor({
  value,
  commit,
  field,
  operator,
}: FilterEditorProps<boolean>) {
  if (operator.arity === "none") return null

  return (
    <Label
      className={cn(
        "flex w-40 cursor-pointer items-center justify-between gap-3 p-2 font-normal",
        field.className,
      )}
    >
      <span className="text-sm">{field.label}</span>
      <Switch
        checked={value === true}
        onCheckedChange={(checked) => commit(checked)}
        aria-label={field.label}
      />
    </Label>
  )
}
