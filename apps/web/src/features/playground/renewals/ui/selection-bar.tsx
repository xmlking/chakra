import { Badge } from "@workspace/ui/components/reui/badge";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";

import { RENEWAL_STAGE_ORDER, type RenewalOwnerOption, type RenewalStage } from "../data";

interface SelectionBarProps {
  selectedCount: number;
  ownerValue: string;
  stageValue: RenewalStage;
  ownerOptions: RenewalOwnerOption[];
  onOwnerChange: (value: string) => void;
  onStageChange: (value: RenewalStage) => void;
  onApply: () => void;
  onClear: () => void;
}

export function SelectionBar({
  selectedCount,
  ownerValue,
  stageValue,
  ownerOptions,
  onOwnerChange,
  onStageChange,
  onApply,
  onClear,
}: SelectionBarProps) {
  return (
    <div className="flex flex-col gap-3 border-y bg-muted/30 px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <Badge size="sm" variant="outline" radius="full">
          {selectedCount} selected
        </Badge>
        <span className="text-xs text-muted-foreground">Update owner or stage.</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <Select
          value={ownerValue}
          onValueChange={(value) => {
            if (!value) return;
            onOwnerChange(value);
          }}
        >
          <SelectTrigger size="sm" className="w-full sm:w-[190px]" aria-label="Assign owner">
            <SelectValue placeholder="Assign owner" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {ownerOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={stageValue} onValueChange={(value) => onStageChange(value as RenewalStage)}>
          <SelectTrigger size="sm" className="w-full sm:w-[190px]" aria-label="Set stage">
            <SelectValue placeholder="Set stage" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {RENEWAL_STAGE_ORDER.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button type="button" size="sm" variant="ghost" onClick={onClear}>
          Deselect
        </Button>
        <Button type="button" size="sm" onClick={onApply}>
          Apply updates
        </Button>
      </div>
    </div>
  );
}
