import { XIcon, MoreHorizontalIcon, EyeIcon, PencilIcon, Trash2Icon, PlusIcon, SearchIcon, SearchXIcon, FunnelXIcon, Settings2Icon, ChevronLeftIcon, ChevronRightIcon, StoreIcon, CalendarPlusIcon, CalendarCheckIcon, CalendarClockIcon, CircleCheckIcon, CircleXIcon, SmartphoneIcon, MailIcon, DownloadIcon, CalendarIcon, MapPinIcon, AlertCircleIcon, ClockIcon, CheckIcon } from "lucide-react";

// One place for the block's glyphs; owners (Button, menu items, IconTile) size them.

/** A labelled button that drops to its icon on a phone stays a square there. */
export const ICON_ON_PHONE = "max-sm:aspect-square max-sm:px-0"

// prettier-ignore
export const UI_ICONS = {
  close:        <XIcon aria-hidden="true" />,
  more:         <MoreHorizontalIcon aria-hidden="true" />,
  view:         <EyeIcon aria-hidden="true" />,
  edit:         <PencilIcon aria-hidden="true" />,
  trash:        <Trash2Icon aria-hidden="true" />,
  plus:         <PlusIcon aria-hidden="true" />,
  search:       <SearchIcon aria-hidden="true" />,
  searchEmpty:  <SearchXIcon aria-hidden="true" />,
  clearFilter:  <FunnelXIcon aria-hidden="true" />,
  settings:     <Settings2Icon aria-hidden="true" />,
  chevronLeft:  <ChevronLeftIcon aria-hidden="true" />,
  chevronRight: <ChevronRightIcon aria-hidden="true" />,
  kitchen:      <StoreIcon aria-hidden="true" />,
  book:         <CalendarPlusIcon aria-hidden="true" />,
  confirm:      <CalendarCheckIcon aria-hidden="true" />,
  reschedule:   <CalendarClockIcon aria-hidden="true" />,
  done:         <CircleCheckIcon aria-hidden="true" />,
  cancel:       <CircleXIcon aria-hidden="true" />,
  phone:        <SmartphoneIcon aria-hidden="true" />,
  mail:         <MailIcon aria-hidden="true" />,
  download:     <DownloadIcon aria-hidden="true" />,
  calendar:     <CalendarIcon aria-hidden="true" />,
  address:      <MapPinIcon aria-hidden="true" />,
}

/** Matrix glyphs: shape and tone both carry the status; the IconTile sizes them. */
// prettier-ignore
export const STATUS_ICONS = {
  missed:    <AlertCircleIcon aria-hidden="true" />,
  proposed:  <ClockIcon aria-hidden="true" />,
  confirmed: <CalendarCheckIcon aria-hidden="true" />,
  done:      <CheckIcon aria-hidden="true" />,
  due:       <CalendarPlusIcon aria-hidden="true" />,
}

/** The toast state glyphs, one per typed method, so every toast reads alike. */
export const TOAST_SUCCESS_ICON = (
  <CircleCheckIcon className="text-success size-4" aria-hidden="true" />
)