import { Button } from "@workspace/ui/components/shadcn/button";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { describe, expect, it, vi } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { render } from "vitest-browser-react";

import { ConfirmationDialog } from "./confirmation-dialog";

function DeleteProjectExample({ onDelete }: { onDelete: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);

    try {
      await onDelete();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <ConfirmationDialog
        open={open}
        title="Delete Docuflow?"
        description="This permanently deletes the project and its documents."
        confirmLabel="Delete project"
        confirmVariant="destructive"
        icon={<Trash2Icon aria-hidden="true" />}
        isPending={isPending}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
      >
        <p>Type-safe child content can be placed between the header and actions.</p>
      </ConfirmationDialog>
    </>
  );
}

describe("ConfirmationDialog", () => {
  it("supports the recommended controlled async usage", async () => {
    const onDelete = vi.fn<() => Promise<void>>().mockResolvedValue();
    const screen = await render(<DeleteProjectExample onDelete={onDelete} />);

    await userEvent.click(screen.getByRole("button", { name: "Delete project" }));

    await expect.element(screen.getByText("Delete Docuflow?")).toBeInTheDocument();
    await expect
      .element(
        screen.getByText("Type-safe child content can be placed between the header and actions."),
      )
      .toBeInTheDocument();

    const confirmButton = screen
      .getByRole("button", { name: "Delete project" })
      .element() as HTMLButtonElement;
    confirmButton.click();

    await vi.waitFor(() => expect(onDelete).toHaveBeenCalledOnce());
    await expect.element(screen.getByText("Delete Docuflow?")).not.toBeInTheDocument();
  });

  it("renders custom content and confirms without closing itself", async () => {
    const onConfirm = vi.fn<() => void>();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    const screen = await render(
      <ConfirmationDialog
        open
        title="Archive report?"
        description="The report will no longer appear in active results."
        confirmLabel="Archive"
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    );

    await expect.element(screen.getByText("Archive report?")).toBeInTheDocument();
    await expect
      .element(screen.getByText("The report will no longer appear in active results."))
      .toBeInTheDocument();

    const confirmButton = screen
      .getByRole("button", { name: "Archive" })
      .element() as HTMLButtonElement;
    confirmButton.click();

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("disables both actions while pending", async () => {
    const screen = await render(
      <ConfirmationDialog
        open
        title="Delete item?"
        description="This cannot be undone."
        isPending
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onConfirm={vi.fn<() => void>()}
      />,
    );

    await expect.element(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await expect.element(screen.getByRole("button", { name: "Confirm" })).toBeDisabled();
  });
});
