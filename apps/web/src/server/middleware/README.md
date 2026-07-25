# Server Middleware

Middleware chain for access control and authorization. Each level builds on the previous context.

## Middleware Stack

1. **authMiddleware** - Authentication
   - Verifies user session exists
   - Sets `context.session` with user and session data
   - Tags request with user/org context for `evlog`

2. **orgRequiredMiddleware** - Organization Context
   - Requires `authMiddleware`
   - Validates user has an active organization selected
   - Passes `context.session` to next middleware

3. **memberRequiredMiddleware** - Organization Membership
   - Requires `orgRequiredMiddleware`
   - Validates user is a member of active organization
   - Queries member record from database
   - Sets `context.member` with organization member info

4. **permissionRequiredMiddleware(permissions)** - Permission Checks
   - Requires `memberRequiredMiddleware`
   - Validates user has required permissions (TODO: implement)
   - Accepts permissions object with resource/action rules

5. **roleRequiredMiddleware(role)** - Role Validation
   - Requires `memberRequiredMiddleware`
   - Validates user has specific organization role
   - Checks `context.member.role` against required role

## Usage

Stack middleware from bottom-up based on your requirements:

```typescript
// Route requiring just authentication
createServerFn()
  .middleware([authMiddleware])
  .handler(({ context }) => {
    /* context.session */
  });

// Route requiring organization membership
createServerFn()
  .middleware([memberRequiredMiddleware])
  .handler(({ context }) => {
    /* context.session, context.member */
  });

// Route requiring specific role
createServerFn()
  .middleware([roleRequiredMiddleware("owner")])
  .handler(({ context }) => {
    /* context.member.role */
  });
```
