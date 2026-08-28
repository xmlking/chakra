import { Badge } from "@workspace/ui/components/reui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import { InputGroupInput } from "@workspace/ui/components/shadcn/input-group";
import { ScrollArea } from "@workspace/ui/components/shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/shadcn/sheet";
import { Spinner } from "@workspace/ui/components/shadcn/spinner";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { Trash2Icon, XIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import { priorityConfig, stageBadgeVariant, statusConfig } from "../columns";
import {
  formatDate,
  formatExactCurrency,
  formatRelativeDays,
  getPerson,
  INDUSTRY_OPTIONS,
  PEOPLE,
  PRIORITY_OPTIONS,
  STAGE_OPTIONS,
  STATUS_OPTIONS,
  type CompanyIndustry,
  type CompanyPriority,
  type CompanyStage,
  type CompanyStatus,
  type ICompany,
} from "../data";
import { EditableDetailRow } from "./editable-detail-row";

const SAVE_DELAY_MS = 520;

type EditableRowId =
  | "stage"
  | "status"
  | "priority"
  | "ownerId"
  | "arr"
  | "health"
  | "renewalDate"
  | "notes"
  | "industry"
  | "employees"
  | "location"
  | "lastActivityDays";

interface CompanyDraft {
  stage: CompanyStage;
  status: CompanyStatus;
  priority: CompanyPriority;
  ownerId: string;
  arr: number;
  health: number;
  renewalDate: string;
  notes: string;
  industry: CompanyIndustry;
  employees: number;
  location: string;
  lastActivityDays: number;
}

function toDraft(company: ICompany): CompanyDraft {
  return {
    stage: company.stage,
    status: company.status,
    priority: company.priority,
    ownerId: company.ownerId,
    arr: company.arr,
    health: company.health,
    renewalDate: company.renewalDate,
    notes: company.notes,
    industry: company.industry,
    employees: company.employees,
    location: company.location,
    lastActivityDays: company.lastActivityDays,
  };
}

// ── Value renderings ──

function DetailValue({
  icon,
  children,
  className,
}: {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex min-h-8 min-w-0 items-center gap-2 text-sm font-medium text-foreground",
        className,
      )}
    >
      {icon ? (
        <span className="flex shrink-0 items-center text-muted-foreground">{icon}</span>
      ) : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

function OwnerValue({ ownerId }: { ownerId: string }) {
  const person = getPerson(ownerId);
  if (!person) return <DetailValue>Unassigned</DetailValue>;

  return (
    <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
      <Avatar className="size-5 shrink-0">
        {person.avatar ? <AvatarImage src={person.avatar} alt="" /> : null}
        <AvatarFallback className="text-[9px]">{person.initials}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate">{person.name}</span>
    </span>
  );
}

function SelectEditor<TValue extends string>({
  id,
  value,
  options,
  disabled,
  renderValue,
  renderOption,
  onValueChange,
}: {
  id: string;
  value: TValue;
  options: { value: TValue; label: string }[];
  disabled: boolean;
  renderValue?: (value: TValue) => ReactNode;
  renderOption?: (option: { value: TValue; label: string }) => ReactNode;
  onValueChange: (value: TValue) => void;
}) {
  return (
    <Select
      value={value}
      disabled={disabled}
      items={options}
      onValueChange={(next) => next && onValueChange(next as TValue)}
    >
      <SelectTrigger
        id={id}
        size="sm"
        disabled={disabled}
        className="h-8 min-w-0 flex-1 border-0 px-2.5 shadow-none"
      >
        <SelectValue>
          {renderValue
            ? renderValue(value)
            : (options.find((option) => option.value === value)?.label ?? value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {renderOption ? renderOption(option) : option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// ── Sheet ──

interface CompanyDetailsSheetProps {
  company: ICompany;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, patch: Partial<ICompany>) => void;
  onDelete: (company: ICompany) => void;
}

export function CompanyDetailsSheet({
  company,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: CompanyDetailsSheetProps) {
  const [draft, setDraft] = useState<CompanyDraft>(() => toDraft(company));
  const [editingRows, setEditingRows] = useState<EditableRowId[]>([]);
  const [savingRows, setSavingRows] = useState<EditableRowId[]>([]);

  // Reset per-record state on a company swap. The sheet is no longer keyed,
  // because remounting it would skip its enter and exit transitions.
  const [shownCompanyId, setShownCompanyId] = useState(company.id);
  if (company.id !== shownCompanyId) {
    setShownCompanyId(company.id);
    setDraft(toDraft(company));
    setEditingRows([]);
    setSavingRows([]);
  }
  const saveTimerRef = useRef<number | null>(null);

  // Closing the sheet mid-save must not leave a timer that fires into an
  // unmounted tree.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const hasEditingRows = editingRows.length > 0;
  const isSaving = savingRows.length > 0;
  const ownerOptions = PEOPLE.map((person) => ({
    value: person.id,
    label: person.name,
  }));

  function beginRowEditing(rowId: EditableRowId) {
    if (isSaving) return;
    setDraft((current) => ({ ...current, [rowId]: toDraft(company)[rowId] }));
    setEditingRows((rows) => (rows.includes(rowId) ? rows : [...rows, rowId]));
  }

  function cancelRowEditing(rowId: EditableRowId) {
    if (isSaving) return;
    setDraft((current) => ({ ...current, [rowId]: toDraft(company)[rowId] }));
    setEditingRows((rows) => rows.filter((row) => row !== rowId));
  }

  function updateDraft<TKey extends keyof CompanyDraft>(key: TKey, value: CompanyDraft[TKey]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function commit(rowIds: EditableRowId[]) {
    if (rowIds.length === 0 || isSaving) return;

    const patch: Partial<ICompany> = {};
    rowIds.forEach((rowId) => {
      Object.assign(patch, { [rowId]: draft[rowId] });
    });

    setSavingRows(rowIds);
    saveTimerRef.current = window.setTimeout(() => {
      onSave(company.id, patch);
      setEditingRows((rows) => rows.filter((row) => !rowIds.includes(row)));
      setSavingRows([]);
      saveTimerRef.current = null;
    }, SAVE_DELAY_MS);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commit([...editingRows]);
  }

  function getEditableRowProps(rowId: EditableRowId) {
    return {
      editing: editingRows.includes(rowId),
      actionsDisabled: isSaving,
      saving: savingRows.includes(rowId),
      onEdit: () => beginRowEditing(rowId),
      onCancel: () => cancelRowEditing(rowId),
      onSave: () => commit([rowId]),
    };
  }

  return (
    <TooltipProvider delay={180}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="inset-y-4 right-4 left-auto h-[calc(100svh-2rem)] w-[min(32rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-xl p-0 outline-none"
        >
          {/* Header */}
          <SheetHeader className="shrink-0 p-0">
            <div className="flex min-h-14 items-center justify-between gap-2 border-b px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                {company.logo ? (
                  <span className="flex size-6 shrink-0 items-center justify-center">
                    {company.logo}
                  </span>
                ) : (
                  <Avatar className="size-6 shrink-0">
                    <AvatarFallback className="text-[10px]">
                      {company.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="min-w-0">
                  <SheetTitle className="truncate text-base font-semibold">
                    {company.name}
                  </SheetTitle>
                  <span className="block truncate text-xs text-muted-foreground">
                    {company.domain}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${company.name}`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(company)}
                >
                  <Trash2Icon aria-hidden="true" />
                </Button>
                <SheetClose
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Close details"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <XIcon aria-hidden="true" />
                    </Button>
                  }
                />
              </div>
            </div>
            <SheetDescription className="sr-only">
              Review and edit this company record.
            </SheetDescription>
          </SheetHeader>

          {/* Content */}
          <div className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <div className="flex min-h-full flex-col px-2 pt-3 pb-6">
                <EditableDetailRow
                  label="Stage"
                  {...getEditableRowProps("stage")}
                  display={
                    <Badge variant={stageBadgeVariant[company.stage]}>{company.stage}</Badge>
                  }
                  renderEdit={(active) => (
                    <SelectEditor
                      id="columns-5-stage"
                      value={draft.stage}
                      options={STAGE_OPTIONS}
                      disabled={!active}
                      renderValue={(value) => (
                        <Badge variant={stageBadgeVariant[value]}>{value}</Badge>
                      )}
                      renderOption={(option) => (
                        <Badge variant={stageBadgeVariant[option.value]}>{option.label}</Badge>
                      )}
                      onValueChange={(value) => updateDraft("stage", value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Status"
                  hint="Drives the health rollup on the pipeline dashboard."
                  {...getEditableRowProps("status")}
                  display={
                    <Badge variant={statusConfig[company.status].variant}>
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full!",
                          statusConfig[company.status].dot,
                        )}
                        aria-hidden="true"
                      />
                      {company.status}
                    </Badge>
                  }
                  renderEdit={(active) => (
                    <SelectEditor
                      id="columns-5-status"
                      value={draft.status}
                      options={STATUS_OPTIONS}
                      disabled={!active}
                      renderValue={(value) => (
                        <Badge variant={statusConfig[value].variant}>
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full!",
                              statusConfig[value].dot,
                            )}
                            aria-hidden="true"
                          />
                          {value}
                        </Badge>
                      )}
                      renderOption={(option) => (
                        <Badge variant={statusConfig[option.value].variant}>
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full!",
                              statusConfig[option.value].dot,
                            )}
                            aria-hidden="true"
                          />
                          {option.label}
                        </Badge>
                      )}
                      onValueChange={(value) => updateDraft("status", value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Priority"
                  {...getEditableRowProps("priority")}
                  display={
                    <Badge variant={priorityConfig[company.priority].variant}>
                      {company.priority}
                    </Badge>
                  }
                  renderEdit={(active) => (
                    <SelectEditor
                      id="columns-5-priority"
                      value={draft.priority}
                      options={PRIORITY_OPTIONS}
                      disabled={!active}
                      renderValue={(value) => (
                        <Badge variant={priorityConfig[value].variant}>{value}</Badge>
                      )}
                      renderOption={(option) => (
                        <Badge variant={priorityConfig[option.value].variant}>{option.label}</Badge>
                      )}
                      onValueChange={(value) => updateDraft("priority", value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Owner"
                  {...getEditableRowProps("ownerId")}
                  display={<OwnerValue ownerId={company.ownerId} />}
                  renderEdit={(active) => (
                    <SelectEditor
                      id="columns-5-owner"
                      value={draft.ownerId}
                      options={ownerOptions}
                      disabled={!active}
                      renderValue={(value) => <OwnerValue ownerId={value} />}
                      renderOption={(option) => <OwnerValue ownerId={option.value} />}
                      onValueChange={(value) => updateDraft("ownerId", value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="ARR"
                  hint="Annual recurring revenue booked against this account."
                  {...getEditableRowProps("arr")}
                  display={<DetailValue>{formatExactCurrency(company.arr)}</DetailValue>}
                  renderEdit={(active) => (
                    <InputGroupInput
                      id="columns-5-arr"
                      type="number"
                      min={0}
                      step={1000}
                      value={draft.arr}
                      disabled={!active}
                      aria-label="ARR"
                      onChange={(event) => updateDraft("arr", Number(event.target.value))}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Health"
                  {...getEditableRowProps("health")}
                  display={<DetailValue>{company.health} of 100</DetailValue>}
                  renderEdit={(active) => (
                    <InputGroupInput
                      id="columns-5-health"
                      type="number"
                      min={0}
                      max={100}
                      value={draft.health}
                      disabled={!active}
                      aria-label="Health score"
                      onChange={(event) => updateDraft("health", Number(event.target.value))}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Next renewal"
                  {...getEditableRowProps("renewalDate")}
                  display={
                    <DetailValue icon={<CalendarIcon className="size-4" aria-hidden="true" />}>
                      {formatDate(company.renewalDate)}
                    </DetailValue>
                  }
                  renderEdit={(active) => (
                    <InputGroupInput
                      id="columns-5-renewal"
                      type="date"
                      value={draft.renewalDate}
                      disabled={!active}
                      aria-label="Next renewal"
                      onChange={(event) => updateDraft("renewalDate", event.target.value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Notes"
                  align="start"
                  {...getEditableRowProps("notes")}
                  display={
                    company.notes ? (
                      <span className="text-sm leading-relaxed text-pretty text-foreground">
                        {company.notes}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground/60">No notes yet</span>
                    )
                  }
                  renderEdit={(active) => (
                    <InputGroupInput
                      id="columns-5-notes"
                      value={draft.notes}
                      disabled={!active}
                      placeholder="Add a note"
                      aria-label="Notes"
                      onChange={(event) => updateDraft("notes", event.target.value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Industry"
                  {...getEditableRowProps("industry")}
                  display={<DetailValue>{company.industry}</DetailValue>}
                  renderEdit={(active) => (
                    <SelectEditor
                      id="columns-5-industry"
                      value={draft.industry}
                      options={INDUSTRY_OPTIONS}
                      disabled={!active}
                      onValueChange={(value) => updateDraft("industry", value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Employees"
                  {...getEditableRowProps("employees")}
                  display={<DetailValue>{company.employees.toLocaleString("en-US")}</DetailValue>}
                  renderEdit={(active) => (
                    <InputGroupInput
                      id="columns-5-employees"
                      type="number"
                      min={0}
                      step={10}
                      value={draft.employees}
                      disabled={!active}
                      aria-label="Employees"
                      onChange={(event) => updateDraft("employees", Number(event.target.value))}
                    />
                  )}
                />
                <EditableDetailRow
                  label="Location"
                  {...getEditableRowProps("location")}
                  display={
                    <DetailValue icon={<MapPinIcon className="size-4" aria-hidden="true" />}>
                      {company.location}
                    </DetailValue>
                  }
                  renderEdit={(active) => (
                    <InputGroupInput
                      id="columns-5-location"
                      value={draft.location}
                      disabled={!active}
                      placeholder="City, country"
                      aria-label="Location"
                      onChange={(event) => updateDraft("location", event.target.value)}
                    />
                  )}
                />

                <EditableDetailRow
                  label="Last activity"
                  hint="Days before the reference date, so the relative label needs no clock."
                  {...getEditableRowProps("lastActivityDays")}
                  display={
                    <DetailValue>{formatRelativeDays(company.lastActivityDays)}</DetailValue>
                  }
                  renderEdit={(active) => (
                    <InputGroupInput
                      id="columns-5-last-activity"
                      type="number"
                      min={0}
                      value={draft.lastActivityDays}
                      disabled={!active}
                      aria-label="Days since last activity"
                      onChange={(event) =>
                        updateDraft("lastActivityDays", Number(event.target.value))
                      }
                    />
                  )}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Footer */}
          <SheetFooter className="shrink-0 border-t bg-background">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!hasEditingRows || isSaving}
                  className="min-w-0 flex-1"
                >
                  {isSaving ? <Spinner className="size-4" /> : null}
                  {isSaving ? "Saving" : "Save changes"}
                </Button>
                <SheetClose
                  render={
                    <Button type="button" variant="outline" className="min-w-0 flex-1">
                      Close
                    </Button>
                  }
                />
              </div>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
