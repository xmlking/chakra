import data from "./api/data.json";
import { ChartAreaInteractive } from "./ui/chart-area-interactive";
import { DataTable } from "./ui/data-table";
import { SectionCards } from "./ui/section-cards";

export function DashboardPage() {
  return (
    <div className="container-wrapper p-0">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
