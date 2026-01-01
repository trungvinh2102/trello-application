# Board API Documentation

## Overview

The Board API provides endpoints for managing boards (projects) and board members with role-based access control.

**Base URL:** `http://localhost:5000/api`

## Authentication

All endpoints require authentication. Include the access token in an HTTP-only cookie named `accessToken`.

## Board CRUD API

### Get All Boards

Get all boards where the authenticated user is a member or owner.

**Endpoint:** `GET /api/boards`

**Authentication:** Required

**Response:**
```json
[
  {
    "id": 1,
    "name": "Marketing Campaign",
    "description": "Quản lý chiến dịch marketing Q4 2024",
    "owner_id": 1,
    "visibility": "workspace",
    "background_color": "#3b82f6",
    "ordered_columns_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Board by ID

Get detailed information about a specific board including its members.

**Endpoint:** `GET /api/boards/:id`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `id` (integer) - Board ID

**Response:**
```json
{
  "id": 1,
  "name": "Marketing Campaign",
  "description": "Quản lý chiến dịch marketing Q4 2024",
  "owner_id": 1,
  "visibility": "workspace",
  "background_color": "#3b82f6",
  "ordered_columns_id": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "members": [
    {
      "id": 1,
      "user_id": 1,
      "role": "admin",
      "joined_at": "2024-01-01T00:00:00.000Z",
      "username": "john_doe",
      "email": "john@example.com",
      "full_name": "John Doe",
      "avatar_url": null
    },
    {
      "id": 2,
      "user_id": 2,
      "role": "member",
      "joined_at": "2024-01-02T00:00:00.000Z",
      "username": "jane_smith",
      "email": "jane@example.com",
      "full_name": "Jane Smith",
      "avatar_url": null
    }
  ]
}
```

**Error Responses:**
- `404` - Board not found
- `403` - You are not a member of this board

---

### Create Board

Create a new board. The authenticated user automatically becomes the owner and admin.

**Endpoint:** `POST /api/boards`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "visibility": "private",
  "background_color": "#10b981"
}
```

**Request Validation:**
- `name` (string, required, 1-100 characters) - Board name
- `description` (string, optional, max 1000 characters) - Board description
- `visibility` (string, optional, default: "private") - Board visibility: "private", "workspace", or "public"
- `background_color` (string, optional) - Hex color code (e.g., "#10b981")

**Response:**
```json
{
  "id": 4,
  "name": "New Project",
  "description": "Project description",
  "owner_id": 1,
  "visibility": "private",
  "background_color": "#10b981",
  "ordered_columns_id": null,
  "created_at": "2024-01-05T00:00:00.000Z",
  "updated_at": "2024-01-05T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Validation error (e.g., invalid color format)

---

### Update Board

Update an existing board's information.

**Endpoint:** `PUT /api/boards/:id`

**Authentication:** Required

**Authorization:** User must be the owner, admin, or member (observers cannot update)

**Path Parameters:**
- `id` (integer) - Board ID

**Request Body:**
```json
{
  "name": "Updated Board Name",
  "description": "Updated description",
  "visibility": "public",
  "background_color": "#f59e0b"
}
```

All fields are optional. Only provided fields will be updated.

**Request Validation:** Same as Create Board

**Response:**
```json
{
  "id": 1,
  "name": "Updated Board Name",
  "description": "Updated description",
  "owner_id": 1,
  "visibility": "public",
  "background_color": "#f59e0b",
  "ordered_columns_id": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-06T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Board not found
- `403` - Insufficient permissions (observer)
- `400` - Validation error

---

### Delete Board

Delete a board and all its associated data (columns, cards, members, etc.).

**Endpoint:** `DELETE /api/boards/:id`

**Authentication:** Required

**Authorization:** Only board owner or admin can delete

**Path Parameters:**
- `id` (integer) - Board ID

**Response:**
```json
{
  "message": "Board deleted successfully"
}
```

**Error Responses:**
- `404` - Board not found
- `403` - Only board owners or admins can delete boards

---

## Board Members API

### Get Board Members

Get all members of a board.

**Endpoint:** `GET /api/boards/:id/members`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `id` (integer) - Board ID

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "role": "admin",
    "joined_at": "2024-01-01T00:00:00.000Z",
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null
  },
  {
    "id": 2,
    "user_id": 2,
    "role": "member",
    "joined_at": "2024-01-02T00:00:00.000Z",
    "username": "jane_smith",
    "email": "jane@example.com",
    "full_name": "Jane Smith",
    "avatar_url": null
  }
]
```

**Error Responses:**
- `404` - Board not found
- `403` - You are not a member of this board

---

### Add Member

Add a new member to the board. Only admins can add members.

**Endpoint:** `POST /api/boards/:id/members`

**Authentication:** Required

**Authorization:** Only admins can add members

**Path Parameters:**
- `id` (integer) - Board ID

**Request Body:**
```json
{
  "user_id": 3,
  "role": "member"
}
```

**OR using email:**
```json
{
  "email": "user@example.com",
  "role": "member"
}
```

**Request Validation:**
- Either `user_id` or `email` must be provided
- `role` (string, required) - Member role: "admin", "member", or "observer" (default: "member")

**Response:**
```json
{
  "id": 3,
  "user_id": 3,
  "role": "member",
  "joined_at": "2024-01-07T00:00:00.000Z",
  "username": "bob_wilson",
  "email": "user@example.com",
  "full_name": "Bob Wilson",
  "avatar_url": null
}
```

**Error Responses:**
- `404` - Board not found or user not found
- `400` - User is already a member of this board, or invalid request
- `403` - Only admins can add members

---

### Update Member Role

Change a member's role on the board. Only admins can update roles.

**Endpoint:** `PUT /api/boards/:id/members/:userId`

**Authentication:** Required

**Authorization:** Only admins can update member roles

**Path Parameters:**
- `id` (integer) - Board ID
- `userId` (integer) - Target user's ID

**Request Body:**
```json
{
  "role": "admin"
}
```

**Request Validation:**
- `role` (string, required) - New role: "admin", "member", or "observer"

**Response:**
```json
{
  "id": 2,
  "user_id": 2,
  "role": "admin",
  "joined_at": "2024-01-02T00:00:00.000Z",
  "username": "jane_smith",
  "email": "jane@example.com",
  "full_name": "Jane Smith",
  "avatar_url": null
}
```

**Error Responses:**
- `404` - Board not found or user is not a member
- `403` - Cannot change owner role, or only admins can update roles

---

### Remove Member

Remove a member from the board. Only admins can remove members.

**Endpoint:** `DELETE /api/boards/:id/members/:userId`

**Authentication:** Required

**Authorization:** Only admins can remove members

**Path Parameters:**
- `id` (integer) - Board ID
- `userId` (integer) - Target user's ID to remove

**Response:**
```json
{
  "message": "Member removed successfully"
}
```

**Error Responses:**
- `404` - Board not found
- `403` - Cannot remove board owner, or only admins can remove members

---

### Leave Board

Allow a user to leave a board voluntarily. Board owners cannot leave their own boards.

**Endpoint:** `DELETE /api/boards/:id/members/leave`

**Authentication:** Required

**Authorization:** User must be a member (not owner)

**Path Parameters:**
- `id` (integer) - Board ID

**Response:**
```json
{
  "message": "Left board successfully"
}
```

**Error Responses:**
- `404` - Board not found
- `403` - Board owner cannot leave the board

---

## Role-Based Access Control

### Board Member Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Create, Read, Update, Delete boards; Invite, Update, Remove members; Manage settings |
| **Member** | Create, Read, Update boards (cannot delete); Cannot manage members |
| **Observer** | Read-only access (cannot create, update, or delete) |

### Special Rules

1. **Board Owner** - The user who created the board. Cannot:
   - Leave their own board
   - Be removed from the board
   - Have their role changed

2. **Admin Only Actions:**
   - Add new members
   - Remove members
   - Update member roles
   - Delete board

3. **Member/Admin Actions:**
   - Create new boards
   - Update board details
   - Add/edit/delete cards, columns

4. **Observer Actions:**
   - View boards and cards only

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request - Invalid input data |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not found - Resource does not exist |
| `500` | Internal server error |

---

## Database Schema

### boards
```sql
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL,
    visibility visibility_enum DEFAULT 'private',
    background_color VARCHAR(20),
    ordered_columns_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### board_members
```sql
CREATE TABLE board_members (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role member_role_enum DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_board_user UNIQUE (board_id, user_id)
);
```

---

## Example Usage

### cURL Examples

**Create a board:**
```bash
curl -X POST http://localhost:5000/api/boards \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "visibility": "private",
    "background_color": "#3b82f6"
  }'
```

**Get board members:**
```bash
curl -X GET http://localhost:5000/api/boards/1/members \
  -b cookies.txt
```

**Add a member by email:**
```bash
curl -X POST http://localhost:5000/api/boards/1/members \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "email": "newuser@example.com",
    "role": "member"
  }'
```

**Update member role:**
```bash
curl -X PUT http://localhost:5000/api/boards/1/members/2 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "role": "admin"
  }'
```

**Leave a board:**
```bash
curl -X DELETE http://localhost:5000/api/boards/1/members/leave \
  -b cookies.txt
```

---

## Notes

- All timestamps are in ISO 8601 format
- Hex color codes must be in format `#RRGGBB` (e.g., "#3b82f6")
- When a board is created, the creator automatically becomes the owner and admin
- Cascade delete is enabled - deleting a board will remove all associated data
- The `ordered_columns_id` field is reserved for future use (column ordering)
