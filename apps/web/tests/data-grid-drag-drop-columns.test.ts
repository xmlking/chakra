import { describe, expect, it } from "vite-plus/test";

import { createBacklogColumns } from "../src/features/data-grid-drag-drop/columns";

describe("createBacklogColumns", () => {
  it("enables sorting for the backlog data columns", () => {
    const columns = createBacklogColumns({ total: 1, onAction: () => {} });

    const sortableColumns = ["task", "owner", "team", "cycle", "dueDate", "status", "effort"];

    for (const id of sortableColumns) {
      const column = columns.find((entry) => entry.id === id);
      expect(column?.enableSorting).toBe(true);
    }
  });
});
