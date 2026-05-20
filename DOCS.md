# project

## tsconfig.json

```
ts-monorepo-linking
   ├─ apps
   │  └─ myapp
   │     ├─ src
   │     └─ tsconfig.json  <<< myapp TS program
   ├─ packages
   │  └─ lib-a
   │     ├─ src
   │     └─ tsconfig.json  <<< lib-a TS program
   ├─ tsconfig.base.json
   └─ tsconfig.json        <<< root-level solution tsconfig
```
