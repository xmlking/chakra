# ui

Shared [shadcn](https://www.shadcn-svelte.com/) ui components for the workspace.

> We will be using [Package Imports](https://ui.shadcn.com/docs/package-imports) and `Target Aliases` for installing components, rewriting imports in `Monorepo`

## Usage

### Adding Registries

```shell
bunx  shadcn registry add
```

### Adding components

To `add/update` **shadcn** `components`, run the following commands:

```shell
cd packages/ui
# SHADCN Component
bunx --bun shadcn@latest add --all --overwrite
# AI Elements (optional)
bunx --bun shadcn@latest add @ai-elements/all
# better-upload (optional)
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/upload-button
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/upload-dropzone
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/upload-dropzone-progress
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/paste-upload-area
# kibo-ui (optional)
bunx --bun shadcn@latest add @kibo-ui/gantt
# reui data-grid
bunx --bun shadcn@latest add -p src/components/reui @reui/data-grid
bunx --bun shadcn@latest add -p src/components/reui @reui/filters
# reui kanban (optional)
bunx --bun shadcn@latest add -p src/components/reui @reui/kanban
# reui combobox (optional)
bunx --bun shadcn@latest add -p src/components/reui @reui/combobox
# reui (base-ui) Async Search Autocomplete  (optional)
bunx --bun shadcn@latest add -p src/components/reui @reui/base-autocomplete
bunx --bun shadcn@latest add -p src/components/reui @reui/base-combobox
bunx --bun shadcn@latest add -p src/components/reui @reui/rating
bunx --bun shadcn@latest add -p src/components/reui @reui/stepper
bunx --bun shadcn@latest add -p src/components/reui @reui/combobox-multiple-user
bunx --bun shadcn@latest add -p src/components/reui @reui/combobox-multiple-expandable
# reui Video Text (optional)
bunx --bun shadcn@latest add -p src/components/reui @reui/video-text
# diceui Action Bar, mask-input, listbox etc (optional)
bun x shadcn@latest add -p src/components/diceui @diceui/action-bar
bun x shadcn@latest add -p src/components/diceui @diceui/badge-overflow
bun x shadcn@latest add -p src/components/diceui @diceui/editable
bun x shadcn@latest add -p src/components/diceui @diceui/listbox
bun x shadcn@latest add -p src/components/diceui @diceui/mask-input
bun x shadcn@latest add -p src/components/diceui @diceui/status
# tiptap from https://tiptap.niazmorshed.dev/ (optional)
bunx --bun shadcn@latest add -p src/components/tiptap https://tiptap.niazmorshed.dev/r/toolbar-provider.json
bunx --bun shadcn@latest add -p src/components/tiptap https://tiptap.niazmorshed.dev/r/starter-kit.json
bunx --bun shadcn@latest add -p src/components/tiptap https://tiptap.niazmorshed.dev/r/search-and-replace.json
bunx --bun shadcn@latest add -p src/components/tiptap https://tiptap.niazmorshed.dev/r/image.json
bunx --bun shadcn@latest add -p src/components/tiptap https://tiptap.niazmorshed.dev/r/color-and-highlight.json
bunx --bun shadcn@latest add -p src/components/tiptap https://tiptap.niazmorshed.dev/r/image-placeholder.json
# creatable-combobox - base-ui based https://flowkit-ui.vzkiss.com/docs
bunx --bun shadcn@latest add -p src/components/flowkit-ui @flowkit-ui/creatable-combobox
```

This will place the ui components in the `packages/ui/src/components` directory.

Preview components before installing them. Search across multiple registries. See the code and all dependencies upfront.

```shell
# List all items from a registry
bunx --bun shadcn@latest list @ai-elements
bunx --bun shadcn@latest list @alpine
bunx --bun shadcn@latest list @reui
bunx --bun shadcn@latest list @magicui
# View items from the registry before installing
bunx --bun shadcn@latest view @ai-elements/message
# Search items from registries
bunx --bun shadcn@latest search @ai-elements -q "message"
```

> [!TIP]
> The full list of registries is available at SHADCN [Registry Directory](https://ui.shadcn.com/docs/directory).
> You can `search`, `view` and `add` items from the registry index without configuring the `components.json` file.

### Adding Blocks

To `add` **[Shadcn](https://ui.shadcn.com/blocks)** `blocks`and
**[MagicUI](https://magicui.design/docs/installation)** `blocks`, run the following commands:

```shell
# add shadcn blocks to `apps/console`
bunx --bun shadcn@latest add sidebar-07 -c apps/console
bunx --bun shadcn@latest add login-03 -c apps/console
bunx --bun shadcn@latest add calendar-05 -c apps/console
bunx --bun shadcn@latest add charts-01 -c apps/console
# add Magic UI blocks to `apps/console`
bunx --bun shadcn@latest add @magicui/cool-mode @magicui/confetti  @magicui/particles -c apps/console
bunx --bun shadcn@latest add @magicui/video-text @magicui/morphing-text @magicui/spinning-text -c apps/console
bunx --bun shadcn@latest add @magicui/grid-pattern @magicui/interactive-grid-pattern -c apps/console
# update blocks in `apps/console` to latest version
bunx --bun shadcn@latest add @magicui/video-text -c apps/console --overwrite
# add [AI Tools Registry](https://ai-tools-registry.vercel.app/) blocks to `apps/console`
bunx --bun shadcn@latest add @ai-tools/weather -c apps/console
bunx --bun shadcn@latest add @ai-tools/calculator -c apps/console
```

### Initial setup

```shell
bunx --bun shadcn@latest init --src-dir sidebar-07
```

### Presets

Use the `apply` command to apply a `preset` to an existing project.

```shell
bunx --bun shadcn@latest apply a2r6bw
# to decode a preset
bunx --bun shadcn@latest preset decode b5owWMfJ8l
# Use preset resolve in an existing project to see the preset that matches your current configuration.
bunx --bun shadcn@latest preset resolve -c packages/ui
```

### shadcn-zod-form (W.I.P)

Generate `shadcn/ui` forms from `Zod` schemas

Usage of [shadcn-zod-form](https://github.com/ilyichv/shadcn-zod-form) CLI

```shell
cd apps/console
bunx shadcn-zod-form@latest init # first time
bunx shadcn-zod-form@latest generate ./path/to/zod/schema.ts
# example
bunx shadcn-zod-form@latest generate src/features/tasks2/aaa.ts \
-n aaa-form -o src/features/tasks2/ \
-f @tanstack/react-form
```
