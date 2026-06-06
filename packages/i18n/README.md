# @workspace/i18n

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

```shell
vp run @workspace/i18n#translate
```
