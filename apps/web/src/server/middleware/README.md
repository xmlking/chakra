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

2. **memberRequiredMiddleware** - Organization Membership
   - Requires `authMiddleware` in stack
   - Validates user is a member of their active organization
   - Queries member record from database
   - Sets `context.member` with member data and role
   - Throws `ForbiddenError` if user is not a member

3. **permissionRequiredMiddleware** - Permission Checks
   - Requires `memberRequiredMiddleware` in stack
   - Validates user has required permissions
   - TODO: Implement permission checking logic
   - Throws `ForbiddenError` if lacking permissions

4. **adminRequiredMiddleware** - Admin Access
   - Requires `memberRequiredMiddleware` in stack
   - Validates user has admin role in organization
   - TODO: Use Better Auth admin plugin APIs for checking
   - Throws `ForbiddenError` if not admin

## Context Flow

Middleware builds context progressively:

- `authMiddleware` → `context.session`
- `memberRequiredMiddleware` → `context.session`, `context.member`
- `permissionRequiredMiddleware` → inherits all above
- `adminRequiredMiddleware` → inherits all above

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

// Route requiring admin access
createServerFn()
  .middleware([adminRequiredMiddleware])
  .handler(({ context }) => {
    const { session, member } = context;
    // member.role verified as admin
  });

// Route with permission check
createServerFn()
  .middleware([permissionRequiredMiddleware])
  .handler(({ context }) => {
    // user has verified permissions
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
