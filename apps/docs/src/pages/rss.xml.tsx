import type { RouteConfig } from "fumapress";

// oxlint-disable-next-line react/only-export-components react-doctor/only-export-components
export async function getConfig() {
  return {
    autoI18n: false,
    render: "static",
  } satisfies RouteConfig;
}

// oxlint-disable-next-line import/no-default-export
export default function Page() {
  return null;
}
