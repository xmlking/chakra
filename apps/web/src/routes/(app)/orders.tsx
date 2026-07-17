import { createFileRoute, useSearch } from "@tanstack/react-router";
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/reui/badge";
import { DataGrid, DataGridContainer } from "@workspace/ui/components/reui/data-grid/data-grid";
import { DataGridColumnFilter } from "@workspace/ui/components/reui/data-grid/data-grid-column-filter";
import { DataGridColumnHeader } from "@workspace/ui/components/reui/data-grid/data-grid-column-header";
import { DataGridPagination } from "@workspace/ui/components/reui/data-grid/data-grid-pagination";
import { DataGridTable } from "@workspace/ui/components/reui/data-grid/data-grid-table";
import { Button } from "@workspace/ui/components/shadcn/button";
import { Checkbox } from "@workspace/ui/components/shadcn/checkbox";
import { format } from "date-fns";
import { useState, useEffect, useCallback } from "react";

import type { Order } from "../api/orders";

interface OrdersSearchParams {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
}

export const Route = createFileRoute("/(app)/orders")({
  staticData: {
    breadcrumb: "Orders",
  },
  validateSearch: (search: Record<string, unknown>): OrdersSearchParams => {
    return {
      page: (search.page as string) ?? "0",
      pageSize: (search.pageSize as string) ?? "10",
      sortBy: (search.sortBy as string) ?? undefined,
      sortOrder: (search.sortOrder as string) ?? "asc",
      status: (search.status as string) ?? undefined,
    };
  },
  component: OrdersPage,
});

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const getStatusBadgeVariant = (status: Order["status"]) => {
  const variants: Record<Order["status"], "default" | "destructive" | "info" | "success"> = {
    pending: "info",
    processing: "default",
    completed: "success",
    cancelled: "destructive",
  };
  return variants[status];
};

function OrdersPage() {
  const search = useSearch({ from: "/(app)/orders" });
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: Number(search.page ?? 0),
    pageSize: Number(search.pageSize ?? 10),
  });
  const [sorting, setSorting] = useState<SortingState>(
    search.sortBy ? [{ id: search.sortBy, desc: search.sortOrder === "desc" }] : [],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    search.status ? [{ id: "status", value: search.status }] : [],
  );
  const [rowSelection, setRowSelection] = useState({});

  // Fetch data from API
  // oxlint-disable-next-line react-doctor/react-compiler-no-manual-memoization
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.pageIndex));
      params.set("pageSize", String(pagination.pageSize));

      if (sorting.length > 0) {
        params.set("sortBy", sorting[0].id);
        params.set("sortOrder", sorting[0].desc ? "desc" : "asc");
      }

      const statusFilter = columnFilters.find((f) => f.id === "status");
      if (statusFilter && statusFilter.value) {
        const statusValue = statusFilter.value as string | string[];
        params.set("status", Array.isArray(statusValue) ? statusValue[0] : statusValue);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);
      const result: OrdersResponse = await response.json();

      setData(result.data);
      setTotal(result.total);
      setPagination({
        pageIndex: result.page,
        pageSize: result.pageSize,
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 50,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Order Number" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue("orderNumber")}</div>,
    },
    {
      accessorKey: "customer",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => <div>{row.getValue("customer")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Total" />,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total"));
        return <div className="font-medium">${(amount / 100).toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataGridColumnHeader
          column={column}
          title="Status"
          filter={<DataGridColumnFilter column={column} title="Status" options={statusOptions} />}
        />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as Order["status"];
        return (
          <Badge variant={getStatusBadgeVariant(status)} size="sm">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "items",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Items" />,
      cell: ({ row }) => <div>{row.getValue("items")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => <DataGridColumnHeader column={column} title="Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        // eslint-disable-next-line react-doctor/no-locale-format-in-render
        return <div className="text-sm">{format(date, "MMM dd, yyyy")}</div>;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      columnFilters,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: total,
  });

  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and track your orders</p>
        </div>
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedRows.length} selected</span>
            <Button variant="outline" size="sm">
              Bulk Action
            </Button>
          </div>
        )}
      </div>

      <DataGrid table={table} recordCount={total} isLoading={isLoading}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridPagination />
      </DataGrid>
    </div>
  );
}
