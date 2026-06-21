import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type Layout = "fixed" | "full";
const layoutPrefix = "layout-";

interface LayoutState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
}

function setupLayout(newLayout: Layout) {
  // Remove any existing layout classes
  document.documentElement.classList.remove("layout-fixed", "layout-full");
  // Add the new layout class
  document.documentElement.classList.add(`${layoutPrefix}${newLayout}`);
}

export const useLayoutStore = create<LayoutState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        layout: "full",

        // Actions
        setLayout: (layout: Layout) => {
          set({ layout });

          // Update the document class
          if (typeof document !== "undefined") {
            setupLayout(layout);
          }
        },
      }),
      {
        name: "layout-storage",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (state && typeof document !== "undefined") {
            setupLayout(state.layout);
          }
        },
      },
    ),
  ),
);
