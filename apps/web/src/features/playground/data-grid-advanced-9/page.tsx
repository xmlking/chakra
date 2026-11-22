import { DataGridView } from "./components/data-grid-view"

export function Page() {
  return (
    <main
      className="mx-auto flex min-h-svh w-full max-w-7xl items-start justify-center p-4 pt-8 sm:p-8 sm:pt-12"
      aria-labelledby="page-heading"
    >
      <h1 id="page-heading" className="sr-only">
        Kitchen service visits
      </h1>
      <DataGridView />
    </main>
  )
}