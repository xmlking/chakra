Here's a detailed prompt you can use with Claude, GPT-5, Cursor, Windsurf, or any coding agent:

Build a production-quality SaaS dashboard layout using TanStack Start, TanStack Router, Tailwind CSS v4, Base UI variant of shadcn/ui, and TypeScript.

Requirements:

## Architecture

- Use TanStack Start file-based routing.
- Use a pathless layout route for the authenticated application shell.
- Layout should be split into:
  - Sticky Header
  - Sidebar
  - Main Content Area

- Follow feature-based organization.
- Avoid inline navigation definitions.
- Navigation data must come from a dedicated [sidebar.config.ts](apps/web/src/config/sidebar.config.ts) file.

## Sidebar

Implement a modern SaaS sidebar similar to Linear, Vercel, GitHub, or Clerk.

### Top Section

Display organization switcher at the top.

Requirements:

- Organization avatar
- Organization name
- Organization switcher dropdown
- Use Base UI menu/dropdown primitives through shadcn components
- Support multiple organizations

Example:

Organization A
Organization B
Organization C

### Search

Below organization switcher add:

- Command menu search trigger
- Use cmdk
- Keyboard shortcut:
  - Windows/Linux: Ctrl+K
  - macOS: Cmd+K

- Search should be accessible from:
  - Sidebar search button
  - Global keyboard shortcut

- Search should support:
  - Navigation links
  - Dashboard pages
  - Settings pages

### Navigation

Navigation must be generated from configuration

Render sidebar dynamically from [sidebar.config.ts](apps/web/src/config/sidebar.config.ts)

Example groups:

- Platform
  - Dashboard
  - Analytics
  - Devices
  - Policies

- Management
  - Users
  - Teams
  - Organizations

- Configuration
  - Settings
  - Integrations
  - Audit Logs

Requirements:

- Active route highlighting
- Collapsible groups
- Route-aware navigation using TanStack Router
- Icons from lucide-react
- Responsive behavior

### Bottom Section

Pin user menu to bottom of sidebar.

Display:

- User avatar
- User name
- User email

Menu items:

- Profile
- Account Settings
- Billing
- Notifications
- Theme
- Sign Out

Use Base UI dropdown/menu primitives via shadcn components.

also add Support, Feedback links on top of `user menu`

## Header

Sticky header across entire application.

Requirements:

- Position sticky
- top: 0
- z-index appropriate for overlays

Header contents:

Left:

- Mobile sidebar trigger
- Breadcrumbs generated from current route

Right:

- Theme switcher
- Notifications button
- User avatar menu

Header should remain visible while content scrolls.

## Mobile Experience

On mobile:

- Sidebar becomes slide-over drawer
- Use shadcn Sheet built on Base UI primitives
- Hamburger menu in header
- Overlay backdrop
- Smooth open/close animation

## Main Content

Requirements:

- Responsive container
- Proper padding
- Scrollable content area
- Support nested routes via Outlet

Example:

```tsx
<Outlet />
```

## Theming

Support:

- Light theme
- Dark theme
- Custom themes using data-theme attribute

Use:

```css
@custom-variant dark (&:is(.dark *), &:is([data-theme$="-dark"] *));
```

Requirements:

- Theme switcher component
- Persist selection
- No flash during hydration

## Accessibility

- Full keyboard navigation
- ARIA labels
- Focus states
- Skip navigation support
- Screen-reader friendly

## Deliverables

Generate complete code for:

- sidebar.config.ts
- app-sidebar.tsx
- organization-switcher.tsx
- nav-group.tsx
- nav-item.tsx
- command-search.tsx
- user-nav.tsx
- dashboard-header.tsx
- dashboard-layout.tsx
- mobile-nav.tsx
- authenticated pathless layout route

Use:

- TanStack Start
- TanStack Router
- Base UI variant shadcn components
- Tailwind CSS v4
- React 19
- TypeScript

Do not use Radix UI imports directly.
Only use shadcn components generated with the Base UI style.
Avoid `asChild` unless absolutely required.
Prefer clean, reusable, strongly typed components.

This prompt is tuned toward the architecture you're already using (TanStack Start + pathless routes + Base UI style shadcn + config-driven navigation) and should produce much better results than a generic "create admin dashboard" prompt.
