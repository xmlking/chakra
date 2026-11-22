# Server Middleware

Middleware chain for access control and authorization. Stack from most restrictive to least based on your requirements.

## Middleware Stack

0. **csrfMiddleware** - CSRF Protection
   - Validates CSRF tokens on server functions
   - Automatically enabled for POST/PUT/DELETE operations
   - Filters requests by `handlerType === "serverFn"`
   - Production: configure `origin` for your deployment URL
   - Zero configuration needed for development

1. **authMiddleware** - Authentication
   - Verifies user session exists
   - Sets `context.session` with user and session data
   - Tags request with user/org context for `evlog`
   - Throws `UnauthorizedError` if no session

2. **orgRequiredMiddleware** - Active Organization

- Requires `authMiddleware` in the stack
- Requires an active organization in the session
- Throws `ForbiddenError` when no organization is active

3. **memberRequiredMiddleware** - Organization Membership

- Requires `orgRequiredMiddleware` in the stack
- Loads the active organization member
- Sets `context.member` with member data and role
- Throws `ForbiddenError` if the user is not a member

4. **roleRequiredMiddleware** - System User Role

- Requires authentication only
- Checks the database user's `role`
- Does not require an organization

1. **orgRoleRequiredMiddleware** - Organization Member Role

- Requires `memberRequiredMiddleware` in the stack
- Checks the active organization member's `role`
- Throws `ForbiddenError` if the role is not allowed

6. **systemPermissionRequiredMiddleware** - System admin/user permissions

- Requires authentication only
- Uses Better Auth's admin permission endpoint
- Does not require an active organization
- Throws `ForbiddenError` if lacking permissions

7. **organizationPermissionRequiredMiddleware** - Organization permissions

- Requires an active organization and member
- Uses Better Auth's organization permission endpoint
- Sets `context.member` through `memberRequiredMiddleware`
- Throws `ForbiddenError` if lacking permissions or membership

8. **systemOrOrganizationPermissionRequiredMiddleware** - Either permission scope

- Allows global admins without an active organization
- Falls back to the active organization member permission check
- Does not add `context.member` because global access has no member context
- Throws `ForbiddenError` if neither scope grants access

## Context Flow

Middleware builds context progressively:

- `authMiddleware` → `context.session`
- `memberRequiredMiddleware` → `context.session`, `context.member`
- `orgRequiredMiddleware` → `context.session` with an active organization
- `systemPermissionRequiredMiddleware` → authentication only
- `organizationPermissionRequiredMiddleware` → `context.session`, `context.member`
- `systemOrOrganizationPermissionRequiredMiddleware` → authentication only; member context is not guaranteed
- `roleRequiredMiddleware(["admin"])` → global user role check
- `orgRoleRequiredMiddleware(["owner", "admin"])` → organization member role check

## Usage Examples

```typescript
// Route requiring just authentication
createServerFn()
  .middleware([authMiddleware])
  .handler(({ context }) => {
    const { session } = context;
  });

// Route requiring organization membership
createServerFn()
  .middleware([memberRequiredMiddleware])
  .handler(({ context }) => {
    const { session, member } = context;
    // member contains: id, role, permissions, etc
  });

// Route requiring an active organization
createServerFn()
  .middleware([orgRequiredMiddleware])
  .handler(({ context }) => {
    const { session } = context;
  });

// Route requiring a global admin role
createServerFn()
  .middleware([roleRequiredMiddleware(["admin"])])
  .handler(({ context }) => {
    const { session } = context;
    // session.user.role verified as admin
  });

// Route with a global admin/user permission check
createServerFn()
  .middleware([systemPermissionRequiredMiddleware({ filters: ["manage"] })])
  .handler(({ context }) => {
    // authenticated user has the global permission
  });

// Route with an organization-member permission check
createServerFn()
  .middleware([organizationPermissionRequiredMiddleware({ filters: ["view"] })])
  .handler(({ context }) => {
    const { session, member } = context;
    // member has the organization-scoped permission
  });

// Route allowing either a global admin or an organization member
createServerFn()
  .middleware([systemOrOrganizationPermissionRequiredMiddleware({ filters: ["view"] })])
  .handler(() => {
    // access granted by either permission scope
  });
```

## CSRF Protection

CSRF middleware is applied globally via TanStack Start and protects all server functions.

### Configuration

**Development:** Works out-of-the-box with automatic CSRF token handling.

**Production:** Update `csrf.ts` to specify your origin:

```typescript
export const csrfMiddleware = createCsrfMiddleware({
  origin: "https://yourdomain.com",
  filter: (ctx) => ctx.handlerType === "serverFn",
});
```

### How It Works

1. Client-side: TanStack Start automatically includes CSRF token in server function calls
2. Server-side: `csrfMiddleware` validates token before handler executes
3. Protection: Prevents cross-site request forgery attacks on state-changing operations

### Token Header

- Token is sent via `X-CSRF-Token` header
- Automatically managed by TanStack Start
- No manual configuration required in most cases

## Error Handling

All middleware throw typed errors from `@workspace/shared/errors`:

- `UnauthorizedError` - No session / unauthenticated
- `ForbiddenError` - Authenticated but insufficient permissions/role
- `NotFoundError` - Resource not found (organization, member)

These are automatically serialized across server/client boundaries via `taggedErrorAdapter`.
