# Authentication & Authorization API Documentation

## Overview

This API implements a secure authentication and authorization system using:
- **JWT (JSON Web Tokens)** for stateless authentication
- **HttpOnly cookies** for secure token storage
- **Role-based access control (RBAC)** at board level
- **Password hashing** with bcrypt (salt rounds: 12)

---

## Authentication Flow

```
1. Register/Login → Server issues Access Token + Refresh Token (HttpOnly cookies)
2. API Requests → Access Token sent automatically via HttpOnly cookie
3. Access Token Expires (15min) → Client auto-requests new tokens via /api/auth/refresh
4. Refresh Token Expires (7 days) → User must login again
```

---

## Database Schema

### Users Table
```sql
users (
  id, username, email, password_hash, 
  full_name, avatar_url, created_at, updated_at
)
```

### Refresh Tokens Table
```sql
refresh_tokens (
  id, user_id, token, expires_at, 
  created_at, is_revoked
)
```

### Board Members Table
```sql
board_members (
  id, board_id, user_id, role (admin/member/observer)
)
```

---

## Endpoints

### 1. Register User

**POST** `/api/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe"
}
```

**Validation:**
- `username`: 3-50 characters, alphanumeric + underscore only
- `email`: Valid email format, max 100 characters
- `password`: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- `full_name`: Optional, max 100 characters

**Response (201):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Cookies Set:**
- `accessToken`: HttpOnly, expires in 15 minutes
- `refreshToken`: HttpOnly, expires in 7 days

**Error Responses:**
- `409 Conflict`: Email or username already exists
- `422 Unprocessable Entity`: Validation errors

---

### 2. Login

**POST** `/api/auth/login`

Authenticates user and returns tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Cookies Set:**
- `accessToken`: HttpOnly, expires in 15 minutes
- `refreshToken`: HttpOnly, expires in 7 days

**Error Responses:**
- `401 Unauthorized`: Invalid email or password

---

### 3. Logout

**POST** `/api/auth/logout`

Logs out current session by revoking refresh token.

**Request:** No body required (cookies sent automatically)

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

---

### 4. Logout All Devices

**POST** `/api/auth/logout-all`

Logs out from all devices by revoking all refresh tokens for the user.

**Request Body:**
```json
{
  "userId": 1
}
```

**Response (200):**
```json
{
  "message": "Logged out from all devices"
}
```

**Cookies Cleared:**
- `accessToken`
- `refreshToken`

---

### 5. Refresh Tokens

**POST** `/api/auth/refresh`

Refreshes access token using refresh token.

**Request:** No body required (refresh token cookie sent automatically)

**Response (200):**
```json
{
  "message": "Tokens refreshed successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Cookies Updated:**
- `accessToken`: New token, expires in 15 minutes
- `refreshToken`: New token, expires in 7 days

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token

---

### 6. Get Current User

**GET** `/api/auth/me`

Get the currently authenticated user's information.

**Request:** No body required (access token cookie sent automatically)

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired access token
- `404 Not Found`: User not found

---

## Middleware

### Auth Middleware

Protects routes by requiring valid access token.

```typescript
import { authMiddleware } from './middleware/auth.middleware';

router.get('/protected', authMiddleware, (req, res) => {
  // req.user is available here
  res.json({ userId: req.user.id });
});
```

**Attaches to Request:**
```typescript
req.user = {
  id: number,
  email: string,
  username: string
}
```

### Optional Auth Middleware

Attaches user info if token exists, but doesn't require it.

```typescript
import { optionalAuthMiddleware } from './middleware/auth.middleware';

router.get('/public', optionalAuthMiddleware, (req, res) => {
  // req.user is available if authenticated
  if (req.user) {
    res.json({ message: `Hello ${req.user.username}` });
  } else {
    res.json({ message: 'Hello, guest!' });
  }
});
```

---

## Authorization (Board-Level)

### Roles

| Role | Description |
|------|-------------|
| **admin** | Full control over board |
| **member** | Can create/edit cards, add comments |
| **observer** | Read-only access |

### Role Permissions

| Permission | Admin | Member | Observer |
|------------|-------|--------|----------|
| `canCreate` | ✅ | ✅ | ❌ |
| `canRead` | ✅ | ✅ | ✅ |
| `canUpdate` | ✅ | ✅ | ❌ |
| `canDelete` | ✅ | ❌ | ❌ |
| `canInviteMembers` | ✅ | ❌ | ❌ |
| `canManageSettings` | ✅ | ❌ | ❌ |

### Middleware Usage

#### 1. Require Board Member

Ensures user is a member of the board.

```typescript
import { requireBoardMember } from './middleware/authorize.middleware';

router.get(
  '/boards/:boardId',
  authMiddleware,
  requireBoardMember('boardId'),
  (req, res) => {
    // req.boardRole is available: 'admin' | 'member' | 'observer'
    res.json({ role: req.boardRole });
  }
);
```

#### 2. Require Specific Role

Ensures user has specific role(s) on the board.

```typescript
import { requireBoardRole } from './middleware/authorize.middleware';

router.post(
  '/boards/:boardId/members',
  authMiddleware,
  requireBoardRole(['admin'], 'boardId'), // Only admins can invite
  (req, res) => {
    res.json({ message: 'Member invited' });
  }
);
```

#### 3. Require Specific Permission

Ensures user has permission to perform action.

```typescript
import { requireBoardPermission } from './middleware/authorize.middleware';

router.delete(
  '/boards/:boardId/columns/:columnId',
  authMiddleware,
  requireBoardPermission('canDelete', 'boardId'), // Admins only
  (req, res) => {
    res.json({ message: 'Column deleted' });
  }
);
```

#### 4. Check Permissions Programmatically

```typescript
import { getBoardRole, hasPermission } from './middleware/authorize.middleware';

const role = await getBoardRole(boardId, userId);
if (role && hasPermission(role, 'canUpdate')) {
  // Allow action
}
```

---

## Example: Protected Board Route

```typescript
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireBoardPermission } from '../middleware/authorize.middleware';

const router = Router();

// Get board (all members can read)
router.get(
  '/boards/:id',
  authMiddleware,
  requireBoardPermission('canRead', 'id'),
  async (req, res) => {
    const board = await BoardModel.findById(req.params.id);
    res.json({ board, userRole: req.boardRole });
  }
);

// Update board (only admins)
router.put(
  '/boards/:id',
  authMiddleware,
  requireBoardPermission('canManageSettings', 'id'),
  async (req, res) => {
    await BoardModel.update(req.params.id, req.body);
    res.json({ message: 'Board updated' });
  }
);

// Delete board (only admins)
router.delete(
  '/boards/:id',
  authMiddleware,
  requireBoardPermission('canDelete', 'id'),
  async (req, res) => {
    await BoardModel.delete(req.params.id);
    res.json({ message: 'Board deleted' });
  }
);

// Create card (admins and members)
router.post(
  '/boards/:id/cards',
  authMiddleware,
  requireBoardPermission('canCreate', 'id'),
  async (req, res) => {
    const card = await CardModel.create(req.body);
    res.json({ card });
  }
);

export default router;
```

---

## Security Features

### 1. Password Security
- Hashed with bcrypt (12 salt rounds)
- Password complexity validation
- Never stored in plain text

### 2. JWT Security
- Access tokens: 15 minute expiry
- Refresh tokens: 7 day expiry
- Token revocation on logout
- Issuer and audience validation

### 3. Cookie Security
- **HttpOnly**: Not accessible via JavaScript (prevents XSS)
- **Secure**: Only sent over HTTPS (production)
- **SameSite**: Strict (prevents CSRF)
- **Path**: Restricted to root path

### 4. CORS Configuration
```typescript
{
  origin: process.env.CORS_ORIGIN,
  credentials: true // Required for HttpOnly cookies
}
```

### 5. Token Refresh Flow
- Automatic refresh when access token expires
- Old refresh token revoked on refresh
- Multiple devices supported (separate refresh tokens)

---

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/trello_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created (register, create) |
| `400` | Bad Request (invalid input) |
| `401` | Unauthorized (no/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (email/username exists) |
| `422` | Validation Error |
| `500` | Internal Server Error |

### Error Response Format

```json
{
  "error": "Error message here"
}
```

---

## Client-Side Integration

### Axios Configuration

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Required for HttpOnly cookies
});

// Response interceptor for auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Auth React Hook

```typescript
import { useState, useEffect } from 'react';
import api from './lib/axios';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return { user, loading, login, register, logout, isAuthenticated: !!user };
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Access Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## Migration

Run the migration to create refresh_tokens table:

```bash
psql -U username -d trello_db -f server/src/migrations/003_add_refresh_tokens.sql
```

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS for secure cookies
- [ ] Configure rate limiting on auth endpoints
- [ ] Set up database backups
- [ ] Enable request logging
- [ ] Configure monitoring/alerting
- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Add 2FA (optional)
