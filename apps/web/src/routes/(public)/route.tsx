import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div>
      <header>Marketing Nav</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
}
