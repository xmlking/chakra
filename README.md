Welcome to your new TanStack Start app!

## Prerequisites

Install [Vite+](https://viteplus.dev/guide/) so the `vp` command is available on your `PATH`.

```shell
brew install node

brew tap oven-sh/bun
brew install bun

brew install vite-plus
vp env off
```

## Getting started

```shell
git clone https://github.com/xmlking/chakra.git
cd chakra
vp install
vp dev
```

Open the URL printed in the terminal (Vite’s default is usually `http://localhost:5173`).

### Everyday commands

| Command              | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `vp run dev`         | Start the dev server (web) with HMR                              |
| `vp build`           | Production build                                                 |
| `vp run web#preview` | Preview the production build locally                             |
| `vp check`           | Format, lint, and type-check (fix with `--fix` where applicable) |
| `vp test`            | Run tests                                                        |
| `vp help`            | List built-in commands and options                               |

`package.json` scripts (`dev`, `build`, `check`, `test`, …) delegate to these same `vp` entry points.

## Building For Production

To build this application for production:

```shell
vp run -r build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```shell
vp run -r test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Linting & Formatting

This project uses [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) formatting. The following scripts are available:

```shell
vp run check
vp run fix
```

## Deploy with Nitro

This project uses Nitro as a generic server adapter, so it can run on any Node-compatible host.

```shell
vp run -r build
vp run -r preview
```

The build output is a self-contained Node server. To deploy, push the `dist/` directory to your host (Render, Fly.io, your own VPS, etc.) and run the server command above.

For host-specific presets (Vercel, Netlify, Cloudflare, AWS Lambda, etc.) and tuning, see https://v3.nitro.build/deploy.

## Clean

> [!WARNING]  
> delete generated directories and `node_modules`. you need to run `vp i` get them back.

```shell
vp run -r clean
```

## Maintain

update dependencies

```shell
vp outdated
vp update --latest -ir
vp upgrade # updates the vp installation itself.
```

# TanStack Chat Application

Am example chat application built with TanStack Start, TanStack Store, and Claude AI.

## .env Updates

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## ✨ Features

### AI Capabilities

- 🤖 Powered by Claude 3.5 Sonnet
- 📝 Rich markdown formatting with syntax highlighting
- 🎯 Customizable system prompts for tailored AI behavior
- 🔄 Real-time message updates and streaming responses (coming soon)

### User Experience

- 🎨 Modern UI with Tailwind CSS and Lucide icons
- 🔍 Conversation management and history
- 🔐 Secure API key management
- 📋 Markdown rendering with code highlighting

### Technical Features

- 📦 Centralized state management with TanStack Store
- 🔌 Extensible architecture for multiple AI providers
- 🛠️ TypeScript for type safety

### AI Code Agents

- 🧠 Spec-Driven Development (SDD) with [Spec Kit](https://speckit.org/)
- 🎁 Feature-Sliced Design ([FSD](https://feature-sliced.design/))
- 🧹 [React Doctor](https://www.react.doctor/): The Tool That Catches What Your AI Agent Gets Wrong

## Architecture

### Tech Stack

- **Frontend Framework**: TanStack Start
- **Routing**: TanStack Router
- **State Management**: TanStack Store
- **Styling**: Tailwind CSS
- **AI Integration**: Anthropic's Claude API

# Paraglide i18n

This add-on wires up ParaglideJS for localized routing and message formatting.

- Messages live in `project.inlang/messages`.
- URLs are localized through the Paraglide Vite plugin and router `rewrite` hooks.
- Run the dev server or build to regenerate the `src/paraglide` outputs.

## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```shell
pnpm dlx shadcn@latest add button
```

## Setting up Better Auth

1. Generate and set the `BETTER_AUTH_SECRET` environment variable in your `.env.local`:

   ```shell
   bunx --bun @better-auth/cli secret
   ```

2. Visit the [Better Auth documentation](https://www.better-auth.com) to unlock the full potential of authentication in your app.

### Adding a Database (Optional)

Better Auth can work in stateless mode, but to persist user data, add a database:

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // ... rest of config
});
```

Then run migrations:

```shell
bunx --bun @better-auth/cli migrate
```

## Features

### Content Management

- Speaker profiles with bios, awards, and specialty information
- Session details with topics, duration, and speaker attribution
- All content in markdown files using content-collections

### AI-Powered Assistance

- Chat with "Remy" the culinary assistant
- Search for speakers and sessions by topic
- Get recommendations based on interests
- Supports multiple AI providers (Anthropic, OpenAI, Gemini, Ollama)

### Routes

- `/` - Home page with featured speakers and sessions
- `/schedule` - Conference schedule with day-by-day timeline
- `/speakers` - All speakers grid
- `/speakers/:slug` - Individual speaker detail page
- `/talks` - All sessions grid
- `/talks/:slug` - Individual session detail page

## Getting Started

```shell
# Create a new project with this example
npx netlify-cta my-conference --example events

# Navigate to the project
cd my-conference

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## AI Configuration

To use the AI assistant, set one of the following environment variables:

```shell
# Anthropic (Claude)
ANTHROPIC_API_KEY=your-key-here

# OpenAI
OPENAI_API_KEY=your-key-here

# Google Gemini
GEMINI_API_KEY=your-key-here

# Ollama (local, no API key needed)
# Just ensure Ollama is running locally
```

The assistant will automatically use the first available provider.

## Theme

The example uses a custom dark theme with:

- **Font**: Playfair Display (display) and Cormorant Garamond (body)
- **Colors**: Copper and gold accents on a dark charcoal background
- **Effects**: Elegant card hover animations, grain texture overlay

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "My App" },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
});
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from "@tanstack/react-start";

const getServerTime = createServerFn({
  method: "GET",
}).handler(async () => {
  return new Date().toISOString();
});

// Use in a component
function MyComponent() {
  const [time, setTime] = useState("");

  useEffect(() => {
    getServerTime().then(setTime);
  }, []);

  return <div>Server time: {time}</div>;
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/hello")({
  server: {
    handlers: {
      GET: () => json({ message: "Hello, World!" }),
    },
  },
});
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/people")({
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json();
  },
  component: PeopleComponent,
});

function PeopleComponent() {
  const data = Route.useLoaderData();
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  );
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
