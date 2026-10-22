import { Badge } from "@workspace/ui/components/shadcn/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/shadcn/card";
import {
  ChartNoAxesCombinedIcon,
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
} from "lucide-react";

import { InfoHover } from "#components/info-hover";

function RevenueHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DollarSignIcon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Total Revenue</p>
      </div>
      <p className="text-xs text-muted-foreground">
        The headline revenue amount for the dashboard. The percentage badge and trend summary add
        context about how revenue is moving.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">How to read it</p>
        <p className="text-[11px] text-muted-foreground">
          Use the total to understand overall revenue and the change indicator to spot its
          direction. This card is a summary, not a transaction-level breakdown.
        </p>
      </div>
    </div>
  );
}

function NewCustomersHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <UserRoundPlusIcon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">New Customers</p>
      </div>
      <p className="text-xs text-muted-foreground">
        The number of customers newly added in the period summarized by this card. Its change badge
        and footer call out the recent acquisition trend.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">How to read it</p>
        <p className="text-[11px] text-muted-foreground">
          Compare new customer activity with Active Accounts to distinguish recent acquisition from
          the size of the active customer base.
        </p>
      </div>
    </div>
  );
}

function ActiveAccountsHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <UsersRoundIcon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Active Accounts</p>
      </div>
      <p className="text-xs text-muted-foreground">
        A snapshot of the accounts currently counted as active. The percentage badge and retention
        note provide context for changes in the account base.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">How to read it</p>
        <p className="text-[11px] text-muted-foreground">
          Consider this count alongside New Customers: together, the cards show the existing account
          base and recent customer additions.
        </p>
      </div>
    </div>
  );
}

function GrowthRateHelp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ChartNoAxesCombinedIcon className="size-4 text-primary" aria-hidden="true" />
        <p className="text-sm font-semibold">Growth Rate</p>
      </div>
      <p className="text-xs text-muted-foreground">
        The dashboard&apos;s percentage measure of growth. The headline rate is paired with a change
        badge and a short performance summary.
      </p>
      <div className="space-y-1.5 rounded-md border bg-muted/40 px-3 py-2">
        <p className="text-[11px] font-medium">How to read it</p>
        <p className="text-[11px] text-muted-foreground">
          A rate expresses relative change rather than an absolute count. Review it with revenue and
          customer metrics to understand the broader trend.
        </p>
      </div>
    </div>
  );
}

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardDescription>Total Revenue</CardDescription>
            <InfoHover>
              <RevenueHelp />
            </InfoHover>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardDescription>New Customers</CardDescription>
            <InfoHover>
              <NewCustomersHelp />
            </InfoHover>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardDescription>Active Accounts</CardDescription>
            <InfoHover>
              <ActiveAccountsHelp />
            </InfoHover>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardDescription>Growth Rate</CardDescription>
            <InfoHover>
              <GrowthRateHelp />
            </InfoHover>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
