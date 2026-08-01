# @workspace/i18n

```
i18n/
├── project.inlang/
│   └── settings.json      # CLI reads this config
├── messages/
│   ├── en.json            # Source language
│   └── de.json            # Translations
└── src/
```

## Usage

### TanStack Start

We have to create a `src/server.ts` file with the following content:

```ts
import { paraglideMiddleware } from "@workspace/i18n/server";
import handler from "@tanstack/react-start/server-entry";

export default {
  fetch(req: Request): Promise<Response> {
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
```

This will ensure that the i18n middleware is properly integrated into the server-side rendering process of TanStack Start.

Use `import { m } from "@workspace/i18n/messages";` to import messages into your project.

## Development

### Build

```shell
vp build packages/i18n
# or
vp run @workspace/i18n#build
```

if you want to build with watch mode

```shell
vp build packages/i18n --watch
# or
vp run @workspace/i18n#dev
```

### Validate

```shell
vp run @workspace/i18n#validate
```

### Run the unit tests

```shell
vp test packages/i18n
```

### Machine Translate

Set `INLANG_GOOGLE_TRANSLATE_API_KEY` to use google translation service,
otherwise fallback to community-operated translation service at `translate.demosjarco.dev`

```shell
vp run @workspace/i18n#translate
```
