"use client";

import { Badge } from "@workspace/ui/components/reui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/shadcn/avatar";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Calendar, CalendarDayButton } from "@workspace/ui/components/shadcn/calendar";
import { Checkbox } from "@workspace/ui/components/shadcn/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/shadcn/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { ScrollArea } from "@workspace/ui/components/shadcn/scroll-area";
import { cn } from "cn";
import {
  CheckIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  ChevronRightIcon,
  CornerUpRightIcon,
  CornerUpLeftIcon,
  ChevronLeftIcon,
  PlusIcon,
  Share2Icon,
  GlobeIcon,
} from "lucide-react";
import { useState, type ComponentProps } from "react";
import { DayButton } from "react-day-picker";

import {
  CALENDAR_ACCOUNTS,
  COLOR_OPTIONS,
  DATES_WITH_EVENTS,
  DEMO_REFERENCE_DATE,
  TIMEZONE,
  UPCOMING_EVENTS,
  type CalendarAccount,
  type CalendarItem,
  type UpcomingEvent,
} from "./data";

// ── Color Picker ──

function ColorPicker({
  currentColor,
  onSelect,
}: {
  currentColor: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 px-2 py-1.5">
      {COLOR_OPTIONS.map((color) => {
        const isSelected = color.value === currentColor;
        return (
          <button
            key={color.id}
            type="button"
            className={cn(
              "flex size-[18px] cursor-pointer items-center justify-center transition-shadow duration-100",
              "rounded-full",
              "hover:ring-2 hover:ring-ring hover:ring-offset-1",
              isSelected && "ring-2 ring-ring ring-offset-1",
            )}
            style={{ backgroundColor: color.value }}
            aria-label={color.id}
            aria-pressed={isSelected}
            onClick={() => onSelect(color.value)}
          >
            {isSelected && <CheckIcon className="size-2.5 text-white" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Calendar Item Row ──

function CalendarItemRow({
  item,
  onToggle,
  onColorChange,
}: {
  item: CalendarItem;
  onToggle: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}) {
  return (
    <div className="group flex h-9 items-center gap-2 pr-1 pl-5">
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: item.color }}
        aria-hidden="true"
      />
      <Checkbox
        checked={item.enabled}
        onCheckedChange={() => onToggle(item.id)}
        aria-label={`Toggle ${item.label}`}
      />
      <span
        className={cn(
          "flex-1 truncate text-sm font-medium",
          item.enabled ? "text-foreground" : "text-muted-foreground line-through",
        )}
      >
        {item.label}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Options for ${item.label}`}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          }
        >
          <MoreHorizontalIcon className="size-3.5" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <ColorPicker
              currentColor={item.color}
              onSelect={(color) => onColorChange(item.id, color)}
            />
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PencilIcon aria-hidden="true" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Account Group ──

function AccountGroup({
  account,
  onToggle,
  onColorChange,
  defaultOpen = false,
}: {
  account: CalendarAccount;
  onToggle: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            className="w-full justify-start px-1.5"
            size="sm"
            aria-label={`Options for ${account.email}`}
          />
        }
      >
        <ChevronRightIcon
          className="size-3.5 shrink-0 opacity-60 transition-all duration-150 in-data-panel-open:rotate-90 in-data-panel-open:opacity-100"
          aria-hidden="true"
        />
        <span className="truncate">{account.email}</span>
        <Badge variant="outline" className="ml-auto" size="sm">
          {account.items.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="py-0.5">
          {account.items.map((item) => (
            <CalendarItemRow
              key={item.id}
              item={item}
              onToggle={onToggle}
              onColorChange={onColorChange}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ── Event Card ──

function EventCard({ event }: { event: UpcomingEvent }) {
  return (
    <Button variant="ghost" className={cn("h-auto w-full items-start gap-2.5 px-3 py-2 text-left")}>
      <span
        className="w-1 shrink-0 self-stretch rounded-full"
        style={{ backgroundColor: event.calendarColor }}
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-snug font-medium text-foreground">
          {event.title}
        </span>
        <span className="text-xs text-muted-foreground">
          {event.startTime} to {event.endTime}
        </span>
      </div>
      {event.attendees && event.attendees.length > 0 && (
        <div className="ml-auto flex -space-x-1">
          {event.attendees.slice(0, 3).map((attendee, i) => (
            <Avatar key={`${attendee.fallback}-${i}`} className="size-5 border-2 border-background">
              {attendee.src && <AvatarImage src={attendee.src} alt={attendee.fallback} />}
              <AvatarFallback className={cn("text-[8px] text-white", attendee.color)}>
                {attendee.fallback}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}
    </Button>
  );
}

// ── Calendar Panel ──

export function CalendarPanel() {
  const [date, setDate] = useState<Date | undefined>(DEMO_REFERENCE_DATE);
  const [month, setMonth] = useState<Date>(DEMO_REFERENCE_DATE);
  const [accounts, setAccounts] = useState<CalendarAccount[]>(CALENDAR_ACCOUNTS);

  const now = DEMO_REFERENCE_DATE;
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const isCurrentMonth = month.getFullYear() === nowYear && month.getMonth() === nowMonth;
  const isPast =
    month.getFullYear() < nowYear ||
    (month.getFullYear() === nowYear && month.getMonth() < nowMonth);

  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stepMonth = (delta: number) =>
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));

  const goToToday = () => {
    setMonth(DEMO_REFERENCE_DATE);
    setDate(DEMO_REFERENCE_DATE);
  };

  const handleToggle = (id: string) => {
    setAccounts((prev) =>
      prev.map((account) => ({
        ...account,
        items: account.items.map((item) =>
          item.id === id ? { ...item, enabled: !item.enabled } : item,
        ),
      })),
    );
  };

  const handleColorChange = (id: string, color: string) => {
    setAccounts((prev) =>
      prev.map((account) => ({
        ...account,
        items: account.items.map((item) => (item.id === id ? { ...item, color } : item)),
      })),
    );
  };

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden bg-background")}>
      {/* Mini calendar - fixed, always visible */}
      <div className="flex shrink-0 flex-col items-center border-b border-border px-1 py-2">
        <div className="flex w-full items-center justify-between px-2 pb-1">
          <span className="text-sm font-medium text-foreground">{monthLabel}</span>
          <div className="flex items-center justify-center gap-0.5">
            {!isCurrentMonth && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={goToToday}
                aria-label="Back to current month"
              >
                {isPast ? (
                  <CornerUpRightIcon className="size-3" aria-hidden="true" />
                ) : (
                  <CornerUpLeftIcon className="size-3" aria-hidden="true" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => stepMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => stepMonth(1)}
              aria-label="Next month"
            >
              <ChevronRightIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={setMonth}
          today={DEMO_REFERENCE_DATE}
          showOutsideDays
          hideNavigation
          className="w-full items-center justify-center p-0 [--cell-size:--spacing(7)]"
          classNames={{
            day_button: " rounded-md   ",
            today: cn("bg-accent text-foreground", "rounded-md"),
            month_caption: "hidden",
            nav: "hidden",
          }}
          components={{
            DayButton: ({
              children,
              modifiers,
              day,
              ...props
            }: ComponentProps<typeof DayButton>) => {
              const dateKey = day.date.toISOString().slice(0, 10);
              const hasEvents = !modifiers.outside && DATES_WITH_EVENTS.has(dateKey);

              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  {hasEvents ? (
                    <span
                      className="size-1 rounded-full bg-primary in-data-[selected-single=true]:bg-primary-foreground!"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="size-1" aria-hidden="true" />
                  )}
                  {children}
                </CalendarDayButton>
              );
            },
          }}
        />
      </div>

      {/* Scrollable content: My Calendars, Up Next, Quick Actions, Timezone */}
      <div className="max-h-full min-h-0 grow">
        <ScrollArea className="mr-0.5 h-full grow">
          <div className="flex h-full flex-col">
            {/* My Calendars */}
            <div className="border-b border-border py-2">
              <div className="px-3 py-1">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  My Calendars
                </span>
              </div>
              <div role="list" className="px-2">
                {accounts.map((account, i) => (
                  <div key={account.id} role="listitem">
                    <AccountGroup
                      account={account}
                      onToggle={handleToggle}
                      onColorChange={handleColorChange}
                      defaultOpen={i === 0}
                    />
                  </div>
                ))}
              </div>
              <div className="px-1.5 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-2 text-sm text-muted-foreground"
                >
                  <PlusIcon className="size-3.5" aria-hidden="true" />
                  Add account
                </Button>
              </div>
            </div>

            {/* Up Next */}
            <div className="border-b border-border py-2">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Up Next
                </span>
                <Badge variant="outline" className="ml-auto" size="sm">
                  {UPCOMING_EVENTS.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-0.5 px-1.5" role="list">
                {UPCOMING_EVENTS.map((event) => (
                  <div key={event.id} role="listitem">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex grow flex-col gap-1 px-3 py-3">
              <Button variant="default" size="sm" className="w-full justify-start">
                <PlusIcon className="size-4" aria-hidden="true" />
                New Event
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-muted-foreground"
              >
                <Share2Icon aria-hidden="true" />
                Share Availability
              </Button>
            </div>

            {/* Timezone */}
            <div className="flex h-(--app-bottom-bar-height) shrink-0 items-center gap-2 border-t border-border px-3">
              <GlobeIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[11px] font-medium text-muted-foreground/60">
                  Your timezone
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {TIMEZONE.abbreviation} ({TIMEZONE.offset}) &middot; {TIMEZONE.region}
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
