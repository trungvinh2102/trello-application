# Column API Documentation

## Overview

The Column API provides endpoints for managing columns (lists) within boards, including CRUD operations, reordering, duplication, and moving columns between boards.

**Base URL:** `http://localhost:5000/api/v1`

## Authentication

All endpoints require authentication. Include the access token in an HTTP-only cookie named `accessToken`.

---

## Column CRUD API

### Get All Columns

Get all columns of a specific board, ordered by position.

**Endpoint:** `GET /api/v1/boards/:boardId/columns`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `boardId` (integer) - Board ID

**Query Parameters:**
- `includeCards` (boolean, optional) - Include cards in response. Default: `false`

**Response (without cards):**
```json
[
  {
    "id": 1,
    "name": "To Do",
    "board_id": 1,
    "position": 0,
    "ordered_columns_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Response (with cards):**
```json
[
  {
    "id": 1,
    "name": "To Do",
    "board_id": 1,
    "position": 0,
    "ordered_columns_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "cards": [
      {
        "id": 1,
        "name": "Task 1",
        "description": null,
        "board_id": 1,
        "column_id": 1,
        "due_date": null,
        "completed": false,
        "position": 0,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

**Error Responses:**
- `404` - Board not found
- `403` - You are not a member of this board

---

### Get Column by ID

Get a specific column by ID.

**Endpoint:** `GET /api/v1/columns/:id`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `id` (integer) - Column ID

**Query Parameters:**
- `includeCards` (boolean, optional) - Include cards in response. Default: `false`

**Response:**
```json
{
  "id": 1,
  "name": "To Do",
  "board_id": 1,
  "position": 0,
  "ordered_columns_id": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Column not found
- `403` - You are not a member of this board

---

### Create Column

Create a new column in a board. The column is automatically added to the end if no position is specified.

**Endpoint:** `POST /api/v1/boards/:boardId/columns`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot create columns)

**Path Parameters:**
- `boardId` (integer) - Board ID

**Request Body:**
```json
{
  "name": "In Progress",
  "position": 1
}
```

**Request Validation:**
- `name` (string, required, 1-100 characters) - Column name
- `position` (integer, optional, ≥ 0) - Column position. If not provided, appended to end

**Response:**
```json
{
  "id": 2,
  "name": "In Progress",
  "board_id": 1,
  "position": 1,
  "ordered_columns_id": null,
  "created_at": "2024-01-02T00:00:00.000Z",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Board not found
- `403` - Observers cannot create columns
- `400` - Validation error

---

### Update Column

Update an existing column's information.

**Endpoint:** `PUT /api/v1/columns/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot update columns)

**Path Parameters:**
- `id` (integer) - Column ID

**Request Body:**
```json
{
  "name": "Updated Name",
  "position": 2
}
```

**Request Validation:**
- `name` (string, optional, 1-100 characters) - New column name
- `position` (integer, optional, ≥ 0) - New column position

**Response:**
```json
{
  "id": 2,
  "name": "Updated Name",
  "board_id": 1,
  "position": 2,
  "ordered_columns_id": null,
  "created_at": "2024-01-02T00:00:00.000Z",
  "updated_at": "2024-01-03T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Column not found
- `403` - Observers cannot update columns
- `400` - Validation error

---

### Delete Column

Delete a column and all its associated cards.

**Endpoint:** `DELETE /api/v1/columns/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot delete columns)

**Path Parameters:**
- `id` (integer) - Column ID

**Response:**
```json
{
  "message": "Column deleted successfully"
}
```

**Error Responses:**
- `404` - Column not found
- `403` - Observers cannot delete columns

**Note:** Deleting a column will cascade delete all cards within it.

---

## Column Reordering

### Reorder Columns

Reorder all columns in a board. This updates both column positions and the board's `ordered_columns_id`.

**Endpoint:** `PUT /api/v1/boards/:boardId/columns/reorder`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot reorder columns)

**Path Parameters:**
- `boardId` (integer) - Board ID

**Request Body:**
```json
{
  "columnIds": [3, 1, 2, 4]
}
```

**Request Validation:**
- `columnIds` (array of integers, required, min 1) - Array of column IDs in new order

**Response:**
```json
[
  {
    "id": 3,
    "name": "To Do",
    "board_id": 1,
    "position": 0,
    "ordered_columns_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 1,
    "name": "In Progress",
    "board_id": 1,
    "position": 1,
    "ordered_columns_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `404` - Board not found
- `403` - Observers cannot reorder columns
- `400` - Validation error

---

## Column Duplication

### Duplicate Column

Duplicate a column including all its cards. The duplicated column is appended to the end.

**Endpoint:** `POST /api/v1/columns/:id/duplicate`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot duplicate columns)

**Path Parameters:**
- `id` (integer) - Column ID to duplicate

**Request Body:**
```json
{
  "newName": "Copy of To Do"
}
```

**Request Validation:**
- `newName` (string, optional, 1-100 characters) - Name for the duplicated column. If not provided, defaults to "OriginalName (Copy)"

**Response:**
```json
{
  "id": 5,
  "name": "Copy of To Do",
  "board_id": 1,
  "position": 4,
  "ordered_columns_id": null,
  "created_at": "2024-01-04T00:00:00.000Z",
  "updated_at": "2024-01-04T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Column not found
- `403` - Observers cannot duplicate columns
- `400` - Validation error

---

## Column Movement

### Move Column

Move a column to a different board, including all its cards.

**Endpoint:** `PUT /api/v1/columns/:id/move`

**Authentication:** Required

**Authorization:** Member or Admin of both source and target boards (Observers cannot move columns)

**Path Parameters:**
- `id` (integer) - Column ID to move

**Request Body:**
```json
{
  "targetBoardId": 2,
  "position": 0
}
```

**Request Validation:**
- `targetBoardId` (integer, required, > 0) - ID of the target board
- `position` (integer, optional, ≥ 0) - Position in target board. If not provided, appended to end

**Response:**
```json
{
  "id": 1,
  "name": "To Do",
  "board_id": 2,
  "position": 0,
  "ordered_columns_id": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-05T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Column or target board not found
- `403` - Observers cannot move columns or not a member of target board
- `400` - Validation error

---

## Database Schema

### columns
```sql
CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    board_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,
    ordered_columns_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_columns_board FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
```

### boards (with ordered_columns_id)
```sql
ALTER TABLE boards ADD COLUMN ordered_columns_id VARCHAR(100);
```

**Note:** `ordered_columns_id` is stored as a JSON array string (e.g., `"[1,3,5,2]"`) for faster column ordering retrieval.

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

## Role-Based Access Control

| Action | Admin | Member | Observer |
|--------|-------|--------|----------|
| View columns | ✅ | ✅ | ✅ |
| Create column | ✅ | ✅ | ❌ |
| Update column | ✅ | ✅ | ❌ |
| Delete column | ✅ | ✅ | ❌ |
| Reorder columns | ✅ | ✅ | ❌ |
| Duplicate column | ✅ | ✅ | ❌ |
| Move column | ✅ | ✅ | ❌ |

---

## Example Usage

### cURL Examples

**Get all columns:**
```bash
curl -X GET "http://localhost:5000/api/v1/boards/1/columns?includeCards=true" \
  -b cookies.txt
```

**Create a column:**
```bash
curl -X POST "http://localhost:5000/api/v1/boards/1/columns" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Review",
    "position": 2
  }'
```

**Reorder columns:**
```bash
curl -X PUT "http://localhost:5000/api/v1/boards/1/columns/reorder" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "columnIds": [3, 1, 2]
  }'
```

**Duplicate a column:**
```bash
curl -X POST "http://localhost:5000/api/v1/columns/1/duplicate" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "newName": "Copy of To Do"
  }'
```

**Move a column:**
```bash
curl -X PUT "http://localhost:5000/api/v1/columns/1/move" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "targetBoardId": 2,
    "position": 0
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format
- When creating a column without specifying position, it's automatically appended to the end
- The `ordered_columns_id` field in the `boards` table is automatically maintained (JSON array of column IDs)
- Deleting a column will cascade delete all associated cards
- Column positions are 0-indexed
- When moving a column, all associated cards are also moved to the target board
