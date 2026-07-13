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
# SHADCN Components
bunx --bun shadcn@latest add --all --overwrite
# Switch utils.ts from clsx + twMerge to [cnfast](https://github.com/aidenybai/cnfast)
bunx --bun shadcn@latest add aidenybai/cnfast/cn

# better-auth-ui Components
bunx shadcn@latest add https://better-auth-ui.com/r/all.json

# Install the complete theme system with all 40+ themes:
bunx shadcn@latest add https://tweakcn-picker.vercel.app/r/nextjs/theme-system.json
# After installing the theme system, add individual themes: (optional)
bunx shadcn@latest add https://tweakcn-picker.vercel.app/r/theme-catppuccin.json
bunx shadcn@latest add https://tweakcn-picker.vercel.app/r/theme-cyberpunk.json

## basecn
bunx --bun shadcn@latest add -p src/components/basecn @basecn/combobox

# AI Elements (optional)
#bunx --bun shadcn@latest add @ai-elements/all
# AI Elements Workflow Components for React Flow (optional)
bunx --bun shadcn@latest add @ai-elements/canvas
bunx --bun shadcn@latest add @ai-elements/connection
bunx --bun shadcn@latest add @ai-elements/controls
bunx --bun shadcn@latest add @ai-elements/edge
bunx --bun shadcn@latest add @ai-elements/node
bunx --bun shadcn@latest add @ai-elements/panel
bunx --bun shadcn@latest add @ai-elements/toolbar
# better-upload (optional)
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/upload-button
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/upload-dropzone
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/upload-dropzone-progress
bunx --bun shadcn@latest add  -p src/components/better-upload @better-upload/paste-upload-area
# files-sdk
bunx --bun shadcn@latest add https://files-sdk.dev/r/capabilities-badges.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/dropzone.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/file-actions.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/file-browser.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/file-list.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/file-preview.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/file-search.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/multipart-uploader.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/share-dialog.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/trash-bin.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/upload-progress.json
bunx --bun shadcn@latest add https://files-sdk.dev/r/version-history.json

# kibo-ui (optional)
bunx --bun shadcn@latest add @kibo-ui/gantt
# reui data-grid
bunx --bun shadcn@latest add @reui/data-grid
bunx --bun shadcn@latest add @reui/filters
bunx --bun shadcn@latest add @reui/rating
# reui kanban (optional)
bunx --bun shadcn@latest add @reui/kanban
# reui (base-ui) Async Search Autocomplete  (optional)
bunx --bun shadcn@latest add @reui/alert
bunx --bun shadcn@latest add @reui/autocomplete
bunx --bun shadcn@latest add @reui/stepper
bunx --bun shadcn@latest add @reui/sortable
bunx --bun shadcn@latest add @reui/timeline
bunx --bun shadcn@latest add @reui/tree
bunx --bun shadcn@latest add @reui/use-file-upload
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
#  Extend UI components for document viewers for PDF, DOCX, XLSX, and CSV (optional)
bunx --bun shadcn@latest add -p src/components/extend @extend/pdf-viewer
bunx --bun shadcn@latest add -p src/components/extend @extend/docx-viewer
bunx --bun shadcn@latest add -p src/components/extend @extend/schema-builder
# assistant-ui
bunx --bun shadcn@latest add @assistant-ui/thread
bunx --bun shadcn@latest add @assistant-ui/model-selector
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
# add shadcn blocks to `apps/web`
bunx --bun shadcn@latest add sidebar-07 -c apps/web
bunx --bun shadcn@latest add login-03 -c apps/web
bunx --bun shadcn@latest add calendar-05 -c apps/web
bunx --bun shadcn@latest add charts-01 -c apps/web
# add Magic UI blocks to `apps/web`
bunx --bun shadcn@latest add @magicui/cool-mode @magicui/confetti  @magicui/particles -c apps/web
bunx --bun shadcn@latest add @magicui/video-text @magicui/morphing-text @magicui/spinning-text -c apps/web
bunx --bun shadcn@latest add @magicui/grid-pattern @magicui/interactive-grid-pattern -c apps/web
# update blocks in `apps/web` to latest version
bunx --bun shadcn@latest add @magicui/video-text -c apps/web --overwrite
# add [AI Tools Registry](https://ai-tools-registry.vercel.app/) blocks to `apps/web`
bunx --bun shadcn@latest add @ai-tools/weather -c apps/web
bunx --bun shadcn@latest add @ai-tools/calculator -c apps/web
```

### Initial setup

```shell
bunx --bun shadcn@latest init --src-dir sidebar-07
```

### Presets

Use the `apply` command to apply a `preset` to an existing project.

```shell
cd packages/ui
# Use one of the available presets: nova, vega, maia, lyra, mira, luma, sera, rhea
bunx --bun shadcn@latest apply --preset nova -c apps/web
# or use custom shared preset
bunx --bun shadcn@latest apply a2r6bw -c apps/web
# to decode a preset
bunx --bun shadcn@latest preset decode b5owWMfJ8l
# Use preset resolve in an existing project to see the preset that matches your current configuration.
bunx --bun shadcn@latest preset resolve -c packages/ui
```

### shadcn-zod-form (W.I.P)

Generate `shadcn/ui` forms from `Zod` schemas

Usage of [shadcn-zod-form](https://github.com/ilyichv/shadcn-zod-form) CLI

```shell
cd apps/web
bunx shadcn-zod-form@latest init # first time
bunx shadcn-zod-form@latest generate ./path/to/zod/schema.ts
# example
bunx shadcn-zod-form@latest generate src/features/tasks2/aaa.ts \
-n aaa-form -o src/features/tasks2/ \
-f @tanstack/react-form
```
