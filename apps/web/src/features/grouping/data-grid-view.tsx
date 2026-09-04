import { type ColumnVisibilityState } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@workspace/ui/components/reui/frame";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/shadcn/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/shadcn/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/shadcn/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/shadcn/select";
import { Switch } from "@workspace/ui/components/shadcn/switch";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/shadcn/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import { PlusIcon, SearchIcon, XIcon, FilterIcon, Settings2Icon, CheckIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { createStoryColumns, type StoryAction } from "./columns";
import { StorySectionCard } from "./components/story-section";
import {
  buildSections,
  countUnchecked,
  DESK_ORDER,
  DESK_TONE,
  filterStories,
  formatCount,
  GROUP_BY_OPTIONS,
  PLACEMENT_ORDER,
  PRODUCTION_AS_OF,
  PUBLICATION,
  STORIES,
  type Desk,
  type GroupBy,
  type Placement,
  type Story,
  type StorySection,
} from "./data";

type TableDensity = "compact" | "comfortable";

type StoryColumnKey = "angle" | "byline" | "filed" | "publish" | "placement" | "assets" | "notes";

const TABLE_DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
];

const DISPLAY_COLUMN_OPTIONS: { key: StoryColumnKey; label: string }[] = [
  { key: "angle", label: "Angle" },
  { key: "byline", label: "Byline" },
  { key: "filed", label: "Filed" },
  { key: "publish", label: "Publish" },
  { key: "placement", label: "Placement" },
  { key: "assets", label: "Assets" },
  { key: "notes", label: "Notes" },
];

// Issue totals belong to the issue, not to the current filter, so they read off
// the whole list once. Each section card carries its own count.
const TOTAL_STORIES = STORIES.length;

function DeskMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 sm:border-l sm:pl-3 sm:first:border-l-0 sm:first:pl-0">
      <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
      {/* `outline` because the Frame gutter is tinted and a solid badge would
          sink into it. */}
      <Badge variant="outline" className="tabular-nums">
        {value}
      </Badge>
    </div>
  );
}

export function DataGridView() {
  const [groupBy, setGroupBy] = useState<GroupBy>("stage");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDesks, setSelectedDesks] = useState<Desk[]>([]);
  const [selectedPlacements, setSelectedPlacements] = useState<Placement[]>([]);
  const [tableDensity, setTableDensity] = useState<TableDensity>("comfortable");
  const [showSlug, setShowSlug] = useState(true);
  // One visibility map shared by every section: separate tables only line up
  // while they show the same column set.
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});

  const isDense = tableDensity === "compact";
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isFiltered =
    normalizedQuery.length > 0 || selectedDesks.length > 0 || selectedPlacements.length > 0;

  const sections = useMemo(
    () =>
      buildSections(
        filterStories(STORIES, {
          query: normalizedQuery,
          desks: selectedDesks,
          placements: selectedPlacements,
        }),
        groupBy,
      ),
    [normalizedQuery, selectedDesks, selectedPlacements, groupBy],
  );

  const visibleStories = sections.flatMap((section) => section.stories);
  const visibleCount = visibleStories.length;
  const visibleUnchecked = countUnchecked(visibleStories);
  const activeFilterCount = selectedDesks.length + selectedPlacements.length;

  const handleStoryAction = useCallback((action: StoryAction, story: Story) => {
    if (action === "open") {
      toast.info("Open draft", { description: story.title });
      return;
    }
    if (action === "proof") {
      toast.message("View assets", {
        description: `${formatCount(story.assets)} attached to ${story.slug}.`,
      });
      return;
    }
    toast.message("Move publish date", {
      description: `${story.title} currently ships ${story.publishLabel}.`,
    });
  }, []);

  const handleAdd = useCallback((section: StorySection) => {
    toast.message("Commission a story", {
      description: `Add a piece to ${section.label}.`,
    });
  }, []);

  const handleCreate = useCallback(() => {
    toast.success("New story", {
      description: "Connect this action to your CMS.",
    });
  }, []);

  const columns = useMemo(
    () => createStoryColumns({ showSlug, onAction: handleStoryAction }),
    [showSlug, handleStoryAction],
  );

  function toggleDesk(desk: Desk, checked: boolean) {
    setSelectedDesks((current) =>
      checked
        ? current.includes(desk)
          ? current
          : [...current, desk]
        : current.filter((item) => item !== desk),
    );
  }

  function togglePlacement(placement: Placement, checked: boolean) {
    setSelectedPlacements((current) =>
      checked
        ? current.includes(placement)
          ? current
          : [...current, placement]
        : current.filter((item) => item !== placement),
    );
  }

  function toggleColumn(key: StoryColumnKey, checked: boolean) {
    setColumnVisibility((current) => ({ ...current, [key]: checked }));
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedDesks([]);
    setSelectedPlacements([]);
  }

  return (
    <section className="flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <Frame>
        {/* Header */}
        <FrameHeader className="flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col">
            <FrameTitle>Production Desk</FrameTitle>
            <FrameDescription className="flex min-w-0 items-center gap-1.5">
              <span className="truncate">{PUBLICATION}</span>
              <span
                aria-hidden="true"
                className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              />
              <span className="shrink-0">{PRODUCTION_AS_OF}</span>
            </FrameDescription>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {/* Both track the visible set, so the header can never contradict the
                section counts underneath it. "Ready" is deliberately absent: it
                is already a band badge. */}
            <DeskMetric
              label="Stories"
              value={
                isFiltered
                  ? `${formatCount(visibleCount)} of ${formatCount(TOTAL_STORIES)}`
                  : formatCount(TOTAL_STORIES)
              }
            />
            <DeskMetric label="Unchecked" value={formatCount(visibleUnchecked)} />
            <Button type="button" onClick={handleCreate}>
              <PlusIcon data-icon="inline-start" aria-hidden="true" />
              New story
            </Button>
          </div>
        </FrameHeader>

        <FramePanel className="bg-card p-0! shadow-none!">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b px-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-xs font-medium text-muted-foreground">Group by</span>
              {/* The page's main control: it rebuilds the sections rather than
                  re-sorting one table, so every option changes the layout. */}
              <ToggleGroup
                multiple={false}
                value={[groupBy]}
                onValueChange={(values) => {
                  const [next] = values;
                  if (typeof next === "string") setGroupBy(next as GroupBy);
                }}
                variant="outline"
                spacing={0}
                aria-label="Group stories by"
                className="shrink-0"
              >
                {GROUP_BY_OPTIONS.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-1.5 lg:justify-end">
              <InputGroup className="w-full min-w-0 lg:w-56">
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                </InputGroupAddon>
                <InputGroupInput
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search stories..."
                  aria-label="Search stories"
                />
                {searchQuery.length > 0 ? (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery("")}
                    >
                      <XIcon className="size-4" aria-hidden="true" />
                    </InputGroupButton>
                  </InputGroupAddon>
                ) : null}
              </InputGroup>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  render={
                    <Button type="button" variant="outline">
                      <FilterIcon data-icon="inline-start" aria-hidden="true" />
                      Filter
                      {activeFilterCount > 0 ? (
                        <Badge variant="secondary">{activeFilterCount}</Badge>
                      ) : null}
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Desk</DropdownMenuLabel>
                    {DESK_ORDER.map((desk) => (
                      <DropdownMenuCheckboxItem
                        key={desk}
                        checked={selectedDesks.includes(desk)}
                        closeOnClick={false}
                        onCheckedChange={(checked) => toggleDesk(desk, checked === true)}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={cn("size-1.5 shrink-0 rounded-full", DESK_TONE[desk].dot)}
                          />
                          {desk}
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Placement</DropdownMenuLabel>
                    {/* Options render the same badge the column shows. */}
                    {PLACEMENT_ORDER.map((placement) => (
                      <DropdownMenuCheckboxItem
                        key={placement}
                        checked={selectedPlacements.includes(placement)}
                        closeOnClick={false}
                        onCheckedChange={(checked) => togglePlacement(placement, checked === true)}
                      >
                        <Badge
                          variant={
                            placement === "Lead"
                              ? "primary-light"
                              : placement === "Feature"
                                ? "info-light"
                                : "outline"
                          }
                        >
                          {placement}
                        </Badge>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline">
                      <Settings2Icon data-icon="inline-start" aria-hidden="true" />
                      Display
                    </Button>
                  }
                />
                <PopoverContent align="end" className="w-[300px] p-0">
                  <FieldGroup className="gap-3 px-3.5 py-3">
                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-medium text-muted-foreground">Table</div>
                      <Field
                        orientation="horizontal"
                        className="min-h-9 items-center justify-between gap-3"
                      >
                        <FieldLabel className="text-sm font-normal">Density</FieldLabel>
                        <Select
                          value={tableDensity}
                          onValueChange={(value) => setTableDensity(value as TableDensity)}
                        >
                          <SelectTrigger size="sm" className="w-[132px] shrink-0">
                            <SelectValue>
                              {
                                TABLE_DENSITY_OPTIONS.find(
                                  (option) => option.value === tableDensity,
                                )?.label
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectGroup>
                              {TABLE_DENSITY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field
                        orientation="horizontal"
                        className="min-h-9 items-center justify-between gap-3"
                      >
                        <FieldLabel htmlFor="desk-slug" className="text-sm font-normal">
                          Story Slug
                        </FieldLabel>
                        <Switch id="desk-slug" checked={showSlug} onCheckedChange={setShowSlug} />
                      </Field>
                    </div>

                    <FieldSeparator className="-mx-3.5" />

                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Display properties
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {DISPLAY_COLUMN_OPTIONS.map((option) => {
                          const active = columnVisibility[option.key] !== false;

                          return (
                            <Button
                              key={option.key}
                              type="button"
                              size="sm"
                              variant={active ? "secondary" : "outline"}
                              className={cn("rounded-full", active && "border-foreground/10")}
                              aria-pressed={active}
                              onClick={() => toggleColumn(option.key, !active)}
                            >
                              {active ? <CheckIcon className="size-4" aria-hidden="true" /> : null}
                              {option.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </FieldGroup>
                </PopoverContent>
              </Popover>

              {isFiltered ? (
                <Button type="button" variant="ghost" onClick={clearFilters}>
                  Clear
                </Button>
              ) : null}
            </div>
          </div>

          {/* Sections. Every group in the dimension renders, including empty
              ones, so a filter narrows the desk without collapsing its shape. */}
          <div className="flex flex-col">
            {visibleCount === 0 ? (
              <div className="flex flex-col items-center gap-1 px-4 py-14 text-center">
                <p className="text-sm font-medium text-foreground">No stories match</p>
                <p className="text-sm text-muted-foreground">
                  Try another desk or clear the filters.
                </p>
              </div>
            ) : (
              sections.map((section) => (
                <StorySectionCard
                  key={section.key}
                  section={section}
                  columns={columns}
                  dense={isDense}
                  columnVisibility={columnVisibility}
                  onAdd={handleAdd}
                />
              ))
            )}
          </div>
        </FramePanel>
      </Frame>
    </section>
  );
}
