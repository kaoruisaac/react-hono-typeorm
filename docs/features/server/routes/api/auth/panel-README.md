# Panel Authentication Routes Specification

## Overview
`panel.ts` provides authentication-related API endpoints for the panel system, including login, logout, and token refresh functionality.

## API Endpoints

### 1. POST `/api/auth/panel/login`
Employee login endpoint that verifies credentials and sets access token and refresh token.

#### Request Format
```json
{
  "email": "string",
  "password": "string"
}
```

#### Response Format
**Success (200):**
```json
{
  "message": "login-success",
  "employee": {
    "hashId": "string",
    "name": "string",
    "email": "string",
    "roles": ["string"],
    "isActive": "boolean"
  }
}
```

**Failure (400):**
```json
{
  "errorMessage": "login-failed" | "account-disabled"
}
```

#### Function Flow
1. Receive email and password
2. Find employee record
3. Check if employee exists
4. Check if employee is active
5. Verify password
6. Set access token and refresh token cookies
7. Return success response

#### Error Handling
- `login-failed`: Account does not exist or password is incorrect
- `account-disabled`: Employee account is disabled

### 2. GET `/api/auth/panel/logout`
Employee logout endpoint that revokes refresh token and clears all cookies.

#### Response
- **Success**: Redirect to `/panel/login`
- **Status Code**: 302 (Redirect)

#### Function Flow
1. Revoke refresh token (remove from cache)
2. Clear all token cookies
3. Redirect to login page

### 3. POST `/api/auth/panel/refresh`
Manual access token refresh endpoint.

#### Request Format
No request body required, uses refresh token cookie

#### Response Format
**Success (200):**
```json
{
  "message": "token-refreshed",
  "employee": {
    "hashId": "string",
    "name": "string",
    "email": "string",
    "roles": ["string"],
    "isActive": boolean
  }
}
```

**Failure (401):**
```json
{
  "errorMessage": "refresh-token-invalid"
}
```

#### Function Flow
1. Read refresh token from cookie
2. Verify refresh token
3. Check if token is in cache and not expired
4. Verify employee status
5. Generate new access token
6. Update access token cookie
7. Return employee information

## Security Features

### 1. Password Verification
- Uses bcrypt for password comparison
- Supports salt rounds configuration

### 2. Token Management
- Sets HttpOnly cookies
- Supports Secure flag (production environment)
- SameSite=Lax prevents CSRF

### 3. Account Status Check
- Verifies if employee is active
- Disabled accounts cannot login

### 4. Token Revocation
- Revokes refresh token on logout
- Prevents token reuse

## Dependencies

### Internal Dependencies
- `server/db/models/Employee`: Employee data model
- `server/services/authToken`: Token management service
- `server/services/bcrypt`: Password encryption service
- `~/shared/RequestError`: Error handling

### External Dependencies
- `hono`: Web framework
- `bcrypt`: Password encryption

## Usage Examples

### Login Request
```javascript
// Frontend login request
const response = await fetch('/api/auth/panel/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const result = await response.json();
if (response.ok) {
  console.log('Login successful:', result.employee);
} else {
  console.error('Login failed:', result.errorMessage);
}
```

### Logout Request
```javascript
// Frontend logout request
const response = await fetch('/api/auth/panel/logout', {
  method: 'GET',
  credentials: 'include'
});

// Will automatically redirect to login page
```

### Refresh Token
```javascript
// Frontend token refresh request
const response = await fetch('/api/auth/panel/refresh', {
  method: 'POST',
  credentials: 'include'
});

const result = await response.json();
if (response.ok) {
  console.log('Token refresh successful:', result.employee);
} else {
  console.error('Token refresh failed:', result.errorMessage);
}
```

## Error Code Reference

| Error Message | Status Code | Description |
|---------------|-------------|-------------|
| `login-failed` | 400 | Account does not exist or password is incorrect |
| `account-disabled` | 400 | Employee account is disabled |
| `refresh-token-invalid` | 401 | Refresh token is invalid or expired |

## Notes

1. **Cookie Settings**: All tokens use HttpOnly cookies, frontend JavaScript cannot access them directly
2. **Auto Refresh**: Middleware automatically handles token refresh, manual refresh endpoint usually not needed
3. **Security**: Passwords are not returned in responses
4. **Redirect**: Automatically redirects to login page after logout
5. **Status Check**: Every operation checks employee account status

## Differences from Previous Version

- **Token Mechanism**: Changed from single token to access token + refresh token dual mechanism
- **Security**: Enhanced cookie security settings
- **User Experience**: Supports automatic token refresh, reduces need for re-login
- **Error Handling**: More detailed error messages and status codes
