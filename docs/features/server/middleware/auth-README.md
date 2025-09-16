# Authentication Middleware Specification

## Overview
`auth.ts` provides authentication middleware that automatically handles access token verification and refresh token refresh mechanisms.

## Features

### 1. Automatic Token Verification
- First attempts to verify access token
- If access token is invalid, automatically attempts to refresh using refresh token
- Seamless user experience without manual token expiration handling

### 2. Smart Refresh Mechanism
- Automatically refreshes when access token expires
- Transparent token management
- Reduces need for users to re-login

## Middleware Flow

```
Request → Verify Access Token → Valid?
                    ↓ No
                Auto refresh using Refresh Token → Success?
                    ↓ No
                Return 401 Error
                    ↓
                Continue processing request (only when authentication succeeds)
```

## API Interface

### `authMiddleware(c: Context, next: () => Promise<void>)`

**Parameters:**
- `c`: Hono Context object
- `next`: Next middleware or route handler function

**Functionality:**
1. Calls `verifyAccessToken(c)` to verify access token
2. `verifyAccessToken` internally handles refresh token refresh automatically
3. Returns 401 error if authentication fails
4. If authentication succeeds, sets employee information to context (`c.set('employee', employee)`)
5. Continues execution of next middleware or route handler function

**Context Settings:**
- `c.get('employee')`: Employee information (JsonEmployee) - only set when authentication succeeds

**Error Response:**
- 401 Unauthorized: Returned when authentication fails

## Usage

### In Routes
```typescript
import authMiddleware from 'server/middleware/auth';

// Apply authentication middleware
app.use('/api/protected/*', authMiddleware);

// Get employee information in route handler
app.get('/api/protected/profile', (c) => {
  const employee = c.get('employee'); // Guaranteed to exist as middleware has verified
  // Handle authenticated request
  return c.json({ employee });
});
```

### In Hono Application
```typescript
import { Hono } from 'hono';
import authMiddleware from 'server/middleware/auth';

const app = new Hono();

// Apply authentication middleware globally
app.use('*', authMiddleware);

// Or for specific routes
app.use('/api/panel/*', authMiddleware);
```

## Error Handling

The middleware directly handles authentication failure cases:
- Returns 401 error directly if authentication fails
- Only authenticated requests continue processing
- Route handlers can safely assume `employee` exists

## Dependencies

- `server/services/authToken`: Provides token verification and refresh functionality
  - `verifyAccessToken()` - internally handles refresh token refresh automatically

## Security Considerations

1. **Transparent Refresh**: User-unaware token refresh
2. **Automatic Cleanup**: Invalid refresh tokens are automatically cleaned up
3. **Status Check**: Verifies employee is still active during refresh
4. **Cookie Security**: Uses HttpOnly cookies to prevent XSS attacks

## Differences from Previous Version

- Previous version: Only verified single token
- New version: Supports access token + refresh token dual mechanism
- Automatic handling of token expiration and refresh
- Better user experience and security

## Notes

1. Middleware automatically sets `employee` to context
2. Returns 401 error directly if authentication fails, does not continue processing
3. Route handlers can safely assume `employee` exists
4. Only authenticated requests reach route handlers
5. Backward compatible, existing route code requires no modification
