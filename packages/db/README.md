# DB

**Data Access Layer** with [Drizzle ORM](https://orm.drizzle.team/) and Postgres Database.

## Development

- Run the unit tests:

```bash
vp test packages/db
```

- Build the library:

```bash
vp build packages/db
```

> Generate and migrate DB schema

> [!NOTE]
> if you get `We've found duplicated index name across public schema` error `generate` commands,
> you have to remove generated `packages/db/src/schema/copy_me_auth.ts` file.

```shell
# `for first time`, generating schema, use `--name=init`
vp run @workspace/db#generate --name=init
# `for first time`, generate empty migration file
# to write your own custom SQL functions/DDL
vp run @workspace/db#generate --custom --name=extra
#  Generate migrations for subsequent schema changes
vp run @workspace/db#generate
# Apply migrations to local database
vp run @workspace/db#migrate
```
