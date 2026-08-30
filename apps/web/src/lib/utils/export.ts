import type { Table } from "@tanstack/react-table";
import { type DataGridFeatures } from "@workspace/ui/components/reui/data-grid/data-grid";
import { toast } from "@workspace/ui/components/shadcn/toast";
import { writeXlsx } from "hucre/xlsx";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportTableToCSV<TData extends object>(
  table: Table<DataGridFeatures, TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {},
): void {
  const { filename = "table", excludeColumns = [], onlySelected = false } = opts;

  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as keyof TData));

  const csvContent = [
    headers.join(","),
    ...(onlySelected ? table.getFilteredSelectedRowModel().rows : table.getRowModel().rows).map(
      (row) =>
        headers
          .map((header) => {
            const cellValue = row.getValue(header);
            return typeof cellValue === "string" ? `"${cellValue.replace(/"/g, '""')}"` : cellValue;
          })
          .join(","),
    ),
  ].join("\n");

  downloadBlob(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), `${filename}.csv`);
}

export async function exportTableToExcel<TData extends object>(
  table: Table<DataGridFeatures, TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | "select" | "actions")[];
    onlySelected?: boolean;
  } = {},
) {
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !opts?.excludeColumns?.includes(id as keyof TData));

  const rows = (
    opts?.onlySelected ? table.getFilteredSelectedRowModel().rows : table.getRowModel().rows
  ).map((row) =>
    headers.reduce(
      (acc, header) => {
        acc[header] = row.getValue(header);
        return acc;
      },
      {} as Record<string, string | number | boolean | Date | null>,
    ),
  );

  try {
    const buffer = await writeXlsx({
      sheets: [
        {
          name: opts.filename ?? "Table",
          columns: headers.map((h) => ({ key: h, header: h })),
          data: rows,
        },
      ],
    });

    downloadBlob(
      new Blob([Uint8Array.from(buffer).buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${opts.filename || "table"}_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  } catch (error) {
    toast.add({
      title: "Failed to export Excel file",
      description: error instanceof Error ? error.message : "Unknown export error",
      type: "error",
    });
    console.error("Excel download error:", error);
  }
}
