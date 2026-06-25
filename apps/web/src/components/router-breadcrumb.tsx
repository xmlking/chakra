/**
 * Source: https://github.com/Balastrong/tanstack-router-demo/blob/main/src/components/navigation/RouterBreadcrumb.tsx
 * Video: https://www.youtube.com/watch?v=6vfmfSCcs54
 */
import { type AnyRouteMatch, Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/shadcn/breadcrumb";
import { Fragment } from "react";

export type BreadcrumbValue = string | string[] | ((match: AnyRouteMatch) => string | string[]);

type ResolvedBreadcrumbItem = {
  path: string;
  label: string;
};

export function RouterBreadcrumb() {
  const matches = useMatches();

  const breadcrumbs: ResolvedBreadcrumbItem[] = matches.flatMap((match) => {
    const staticData = match.staticData;
    if (!staticData?.breadcrumb) return [];

    const breadcrumbValue =
      typeof staticData.breadcrumb === "function"
        ? staticData.breadcrumb(match)
        : staticData.breadcrumb;

    const items = Array.isArray(breadcrumbValue) ? breadcrumbValue : [breadcrumbValue];

    return items.map((item) => ({
      label: item,
      path: match.pathname,
    }));
  });

  if (breadcrumbs.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={`${crumb.path}-${index}`}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="capitalize" render={<Link to={crumb.path} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
