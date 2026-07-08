# Server Middleware

## Order

Add middleware in the order.

1. Auth Middleware
   1. Check user authenticated
   2. Check user authorized
   3. Add user context to `evlog`
2. Error Handling Middleware
   1. Transform `better-result` Result to UI `ServerResponse`,
   2. Transform `ZodError` to UI `ServerResponse`,
