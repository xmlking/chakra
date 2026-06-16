import { Link } from "@tanstack/react-router";

import { navigation } from "./nav-config";

export function AppSidebar() {
  return (
    <aside className="hidden border-r lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="font-semibold">
          <Link to="/" className="flex items-center">
            <span className="text-lg font-bold tracking-tight">Chakra</span>
          </Link>
        </h1>
      </div>

      <nav className="flex-1 p-3">
        {navigation.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{
              className: "bg-accent text-accent-foreground",
            }}
            className="flex items-center gap-3 rounded-md px-3 py-2"
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
