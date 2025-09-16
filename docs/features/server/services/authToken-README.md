# AuthToken Service Specification

## Overview
`authToken.ts` provides comprehensive JWT token management functionality, including generation, verification, refresh, and revocation mechanisms for access tokens and refresh tokens.

## Features

### 1. Dual Token Mechanism
- **Access Token**: Short-term validity (15 minutes), used for API request authentication
- **Refresh Token**: Long-term validity (7 days), used for refreshing access tokens

### 2. Security
- Uses HttpOnly cookies to prevent XSS attacks
- Supports Secure flag (production environment)
- SameSite=Lax prevents CSRF attacks
- Simplified token structure, reduces complexity

### 3. Token Management
- Uses JWT built-in expiration mechanism, no additional cache needed
- Supports manual refresh token revocation (clear cookie)

## API Interface

### Main Functions

#### `setEmployeeTokens(c: Context, employee: Employee)`
Sets employee's access token and refresh token cookies.

**Parameters:**
- `c`: Hono Context object
- `employee`: Employee entity

**Functionality:**
- Generates access token (15 minutes validity)
- Generates refresh token (7 days validity)
- Sets HttpOnly cookies

#### `verifyAccessToken(c: Context): Promise<JsonEmployee | null>`
Verifies access token and returns employee information. If access token is invalid, automatically attempts to refresh using refresh token.

**Parameters:**
- `c`: Hono Context object

**Return Value:**
- `JsonEmployee | null`: Employee information or null

**Functionality:**
- Reads access token from cookie
- Verifies token signature and type
- If access token is invalid, automatically uses refresh token to refresh
- Returns employee information

#### `refreshAccessToken(c: Context): Promise<JsonEmployee | null>` (Internal Function)
Internal function that uses refresh token to generate new access token. Usually not needed to call directly as `verifyAccessToken` handles it automatically.

**Parameters:**
- `c`: Hono Context object

**Return Value:**
- `JsonEmployee | null`: Employee information or null

**Functionality:**
- Verifies refresh token (JWT automatically handles expiration check)
- Verifies employee status
- Generates new access token
- Updates access token cookie

#### `removeEmployeeTokens(c: Context)`
Removes all token cookies.

**Parameters:**
- `c`: Hono Context object

**Functionality:**
- Deletes access-token cookie
- Deletes refresh-token cookie

#### `revokeRefreshToken(c: Context)`
Revokes refresh token.

**Parameters:**
- `c`: Hono Context object

**Functionality:**
- Clears refresh token cookie
- Prevents token reuse

### Helper Functions

Since cache mechanism is not used, cleanup functions are no longer needed.

## Token Structure

### Access Token Payload
```typescript
interface AccessTokenPayload {
  employee: JsonEmployee;
  type: 'access';
  iat: number;
  exp: number;
  [key: string]: any;
}
```

### Refresh Token Payload
```typescript
interface RefreshTokenPayload {
  employeeId: string;
  type: 'refresh';
  iat: number;
  exp: number;
  [key: string]: any;
}
```

## Configuration

### Environment Variables
- `JWT_SECRET`: JWT signing key
- `ENVIRONMENT`: Environment setting (development/production)

### Token Validity Period
- Access Token: 15 minutes
- Refresh Token: 7 days

## Backward Compatibility

To maintain backward compatibility, old function names are preserved:
- `wrapEmployeeTokenInfoCookie` → `setEmployeeTokens`
- `removeEmployeeTokenInfoCookie` → `removeEmployeeTokens`
- `verifyEmployeeToken` → `verifyAccessToken`

## Security Considerations

1. **Token Storage**: Uses JWT built-in expiration mechanism, no additional storage needed
2. **Cookie Security**: HttpOnly, Secure (production environment), SameSite=Lax
3. **Token Revocation**: Supports manual refresh token revocation (clear cookie)
4. **Expiration Handling**: JWT automatically handles token expiration check
5. **Employee Status Check**: Verifies employee is still active during refresh

## Usage Examples

```typescript
// Set tokens during login
await setEmployeeTokens(c, employee);

// Verify access token (automatically handles refresh token refresh)
const employee = await verifyAccessToken(c);

// Remove tokens during logout
removeEmployeeTokens(c);
await revokeRefreshToken(c);
```
