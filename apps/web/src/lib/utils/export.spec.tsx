import type { Table } from "@tanstack/react-table";
import { type DataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { exportTableToCSV, exportTableToExcel } from "./export";

function createTable() {
  return {
    getAllLeafColumns: () => [{ id: "name" }],
    getFilteredSelectedRowModel: () => ({
      rows: [{ getValue: () => "test 123" }],
    }),
    getRowModel: () => ({ rows: [] }),
  } as unknown as Table<DataGridFeatures, { name: string }>;
}

describe("table export", () => {
  afterEach(() => vi.restoreAllMocks());

  it("clicks a download link and releases the object URL", () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    exportTableToCSV(createTable(), { filename: "batches", onlySelected: true });

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:export");
  });

  it("creates and clicks an Excel download", async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:excel");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    await exportTableToExcel(createTable(), { filename: "batches", onlySelected: true });

    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:excel");
  });
});
