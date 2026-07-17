import { createFileRoute } from "@tanstack/react-router";

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  items: number;
}

// Mock data generator
function generateMockOrders(count: number = 50): Order[] {
  const statuses: Array<"pending" | "processing" | "completed" | "cancelled"> = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ];
  const customers = [
    "Alice Johnson",
    "Bob Smith",
    "Carol Williams",
    "David Brown",
    "Emma Davis",
    "Frank Miller",
    "Grace Wilson",
    "Henry Taylor",
  ];

  const orders: Order[] = [];
  for (let i = 1; i <= count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    orders.push({
      id: `order-${i}`,
      orderNumber: `ORD-${String(i).padStart(6, "0")}`,
      customer,
      email: `${customer.toLowerCase().replace(" ", ".")}@example.com`,
      total: Math.floor(Math.random() * 10000) + 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      items: Math.floor(Math.random() * 10) + 1,
    });
  }
  return orders;
}

export const Route = createFileRoute("/api/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);

          // Parse pagination
          const page = parseInt(url.searchParams.get("page") ?? "0", 10);
          const pageSize = parseInt(url.searchParams.get("pageSize") ?? "10", 10);

          // Parse sorting
          const sortBy = url.searchParams.get("sortBy");
          const sortOrder = url.searchParams.get("sortOrder") ?? "asc";

          // Parse filters
          const statusFilter = url.searchParams.get("status");

          // Get all orders
          let orders = generateMockOrders(100);

          // Apply filters
          if (statusFilter && statusFilter !== "all") {
            orders = orders.filter((order) => order.status === statusFilter);
          }

          // Apply sorting
          if (sortBy) {
            orders.sort((a, b) => {
              const aValue = a[sortBy as keyof Order];
              const bValue = b[sortBy as keyof Order];

              if (typeof aValue === "string") {
                return sortOrder === "asc"
                  ? aValue.localeCompare(bValue as string)
                  : (bValue as string).localeCompare(aValue);
              }

              return sortOrder === "asc"
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
            });
          }

          const total = orders.length;

          // Apply pagination
          const start = page * pageSize;
          const paginatedOrders = orders.slice(start, start + pageSize);

          return new Response(
            JSON.stringify({
              data: paginatedOrders,
              total,
              page,
              pageSize,
              pages: Math.ceil(total / pageSize),
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("Orders API error:", error);
          return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
