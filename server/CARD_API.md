# Card API Documentation

## Overview

The Card API provides endpoints for managing cards, card members, labels, and checklists within columns and boards.

**Base URL:** `http://localhost:5000/api/v1`

## Authentication

All endpoints require authentication. Include the access token in an HTTP-only cookie named `accessToken`.

---

## Card CRUD API

### Get All Cards

Get all cards within a specific column, ordered by position.

**Endpoint:** `GET /api/v1/columns/:columnId/cards`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `columnId` (integer) - Column ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "Task 1",
    "description": "Complete this task",
    "board_id": 1,
    "column_id": 1,
    "due_date": "2024-01-15T18:00:00.000Z",
    "completed": false,
    "position": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "is_overdue": false
  }
]
```

**Error Responses:**
- `404` - Column not found
- `403` - You are not a member of this board

---

### Get Card by ID

Get detailed information about a specific card including members, labels, and checklists with progress.

**Endpoint:** `GET /api/v1/cards/:id`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `id` (integer) - Card ID

**Response:**
```json
{
  "id": 1,
  "name": "Task 1",
  "description": "Complete this task",
  "board_id": 1,
  "column_id": 1,
  "due_date": "2024-01-15T18:00:00.000Z",
  "completed": false,
  "position": 0,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "is_overdue": false,
  "members": [
    {
      "id": 1,
      "card_id": 1,
      "user_id": 2,
      "role": "member",
      "assigned_at": "2024-01-01T00:00:00.000Z",
      "username": "john_doe",
      "email": "john@example.com",
      "full_name": "John Doe",
      "avatar_url": null
    }
  ],
  "labels": [
    {
      "id": 1,
      "name": "Urgent",
      "color": "#ef4444",
      "board_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "checklists": [
    {
      "id": 1,
      "name": "To-do list",
      "card_id": 1,
      "position": 0,
      "created_at": "2024-01-01T00:00:00.000Z",
      "total_items": 3,
      "completed_items": 1,
      "progress": 33,
      "items": [
        {
          "id": 1,
          "checklist_id": 1,
          "name": "Task 1",
          "completed": false,
          "position": 0,
          "completed_at": null
        },
        {
          "id": 2,
          "checklist_id": 1,
          "name": "Task 2",
          "completed": true,
          "position": 1,
          "completed_at": "2024-01-02T10:00:00.000Z"
        },
        {
          "id": 3,
          "checklist_id": 1,
          "name": "Task 3",
          "completed": false,
          "position": 2,
          "completed_at": null
        }
      ]
    }
  ]
}
```

**Error Responses:**
- `404` - Card not found
- `403` - You are not a member of this board

---

### Create Card

Create a new card in a column. The card is automatically appended to the end if no position is specified.

**Endpoint:** `POST /api/v1/columns/:columnId/cards`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot create cards)

**Path Parameters:**
- `columnId` (integer) - Column ID

**Request Body:**
```json
{
  "name": "New Task",
  "description": "Task description here",
  "due_date": "2024-01-20T18:00:00Z",
  "position": 0
}
```

**Request Validation:**
- `name` (string, required, 1-200 characters) - Card name
- `description` (string, optional, max 5000 characters) - Card description
- `due_date` (date, optional) - Due date in ISO 8601 format
- `position` (integer, optional, ≥ 0) - Card position. If not provided, appended to end

**Response:**
```json
{
  "id": 5,
  "name": "New Task",
  "description": "Task description here",
  "board_id": 1,
  "column_id": 1,
  "due_date": "2024-01-20T18:00:00.000Z",
  "completed": false,
  "position": 3,
  "created_at": "2024-01-05T00:00:00.000Z",
  "updated_at": "2024-01-05T00:00:00.000Z",
  "is_overdue": false
}
```

**Error Responses:**
- `404` - Column not found
- `403` - Observers cannot create cards
- `400` - Validation error

---

### Update Card

Update an existing card's information.

**Endpoint:** `PUT /api/v1/cards/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot update cards)

**Path Parameters:**
- `id` (integer) - Card ID

**Request Body:**
```json
{
  "name": "Updated Task",
  "description": "Updated description",
  "due_date": "2024-01-25T18:00:00Z",
  "completed": true,
  "position": 1,
  "column_id": 2
}
```

**Request Validation:**
- `name` (string, optional, 1-200 characters) - New card name
- `description` (string, optional, max 5000 characters) - New description
- `due_date` (date, optional, nullable) - New due date (or null to remove)
- `completed` (boolean, optional) - Mark as completed
- `position` (integer, optional, ≥ 0) - New position
- `column_id` (integer, optional, > 0) - Move to different column

**Response:**
```json
{
  "id": 5,
  "name": "Updated Task",
  "description": "Updated description",
  "board_id": 1,
  "column_id": 2,
  "due_date": "2024-01-25T18:00:00.000Z",
  "completed": true,
  "position": 1,
  "completed_at": "2024-01-05T12:30:00.000Z",
  "created_at": "2024-01-05T00:00:00.000Z",
  "updated_at": "2024-01-05T12:30:00.000Z",
  "is_overdue": false
}
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot update cards
- `400` - Validation error

---

### Delete Card

Delete a card and all its associated data (comments, attachments, checklists, etc.).

**Endpoint:** `DELETE /api/v1/cards/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot delete cards)

**Path Parameters:**
- `id` (integer) - Card ID

**Response:**
```json
{
  "message": "Card deleted successfully"
}
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot delete cards

**Note:** Deleting a card will cascade delete all associated data including comments, attachments, checklists, and items.

---

## Card Movement

### Move Card

Move a card to a different column (or same column with new position). Only supported within the same board.

**Endpoint:** `PUT /api/v1/cards/:id/move`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot move cards)

**Path Parameters:**
- `id` (integer) - Card ID

**Request Body:**
```json
{
  "target_column_id": 2,
  "position": 0
}
```

**Request Validation:**
- `target_column_id` (integer, required, > 0) - Target column ID
- `position` (integer, optional, ≥ 0) - New position in target column. If not provided, appended to end

**Response:**
```json
{
  "id": 1,
  "name": "Task 1",
  "description": "Complete this task",
  "board_id": 1,
  "column_id": 2,
  "due_date": null,
  "completed": false,
  "position": 0,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-05T13:00:00.000Z"
}
```

**Error Responses:**
- `404` - Card or target column not found
- `403` - Observers cannot move cards or not a member of this board
- `400` - Cannot move cards between boards

**Note:** Card movement between different boards is not supported.

---

## Card Duplication

### Duplicate Card

Duplicate a card including all its checklists, items, labels, and members. The duplicated card is appended to the end.

**Endpoint:** `POST /api/v1/cards/:id/duplicate`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot duplicate cards)

**Path Parameters:**
- `id` (integer) - Card ID to duplicate

**Request Body:**
```json
{
  "target_column_id": 2,
  "name": "Copy of Task 1"
}
```

**Request Validation:**
- `target_column_id` (integer, optional, > 0) - Target column ID. If not provided, same column
- `name` (string, optional, 1-200 characters) - Name for duplicated card. If not provided, defaults to "CardName (Copy)"

**Response:**
```json
{
  "id": 6,
  "name": "Copy of Task 1",
  "description": "Complete this task",
  "board_id": 1,
  "column_id": 2,
  "due_date": null,
  "completed": false,
  "position": 5,
  "created_at": "2024-01-05T14:00:00.000Z",
  "updated_at": "2024-01-05T14:00:00.000Z"
}
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot duplicate cards
- `400` - Validation error

**Note:** Duplicated card includes all checklists, items, and labels. Members are NOT duplicated.

---

## Card Archive/Restore

### Archive/Restore Card

Archive or restore a card (using the `completed` field).

**Endpoint:** `PUT /api/v1/cards/:id/archive`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot archive cards)

**Path Parameters:**
- `id` (integer) - Card ID

**Request Body:**
```json
{
  "archived": true
}
```

**Request Validation:**
- `archived` (boolean, required) - `true` to archive, `false` to restore

**Response:**
```json
{
  "id": 1,
  "name": "Task 1",
  "description": "Complete this task",
  "board_id": 1,
  "column_id": 1,
  "due_date": null,
  "completed": true,
  "position": 0,
  "completed_at": "2024-01-05T15:00:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-05T15:00:00.000Z"
}
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot archive cards

---

## Card Members API

### Get Card Members

Get all members assigned to a card.

**Endpoint:** `GET /api/v1/cards/:id/members`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `id` (integer) - Card ID

**Response:**
```json
[
  {
    "id": 1,
    "card_id": 1,
    "user_id": 2,
    "role": "member",
    "assigned_at": "2024-01-01T00:00:00.000Z",
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null
  }
]
```

**Error Responses:**
- `404` - Card not found
- `403` - You are not a member of this board

---

### Add Member to Card

Assign a member to a card. The user must already be a member of the board.

**Endpoint:** `POST /api/v1/cards/:id/members`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot add card members)

**Path Parameters:**
- `id` (integer) - Card ID

**Request Body (using user ID):**
```json
{
  "user_id": 3
}
```

**Request Body (using email):**
```json
{
  "email": "user@example.com"
}
```

**Request Validation:**
- `user_id` (integer, optional, > 0) - User ID to assign
- `email` (string, optional, valid email) - User email to assign
- Either `user_id` or `email` must be provided

**Response:**
```json
{
  "id": 2,
  "card_id": 1,
  "user_id": 3,
  "role": "member",
  "assigned_at": "2024-01-05T16:00:00.000Z",
  "username": "jane_smith",
  "email": "user@example.com",
  "full_name": "Jane Smith",
  "avatar_url": null
}
```

**Error Responses:**
- `404` - Card or user not found
- `403` - Observers cannot add card members or user must be a member of board first
- `400` - User is already a member of this card

---

### Remove Member from Card

Remove a member from a card.

**Endpoint:** `DELETE /api/v1/cards/:id/members/:userId`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot remove card members)

**Path Parameters:**
- `id` (integer) - Card ID
- `userId` (integer) - User ID to remove

**Response:**
```json
{
  "message": "Member removed successfully"
}
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot remove card members
- `400` - Failed to remove member

---

### Batch Add Members to Card

Add multiple members to a card at once.

**Endpoint:** `POST /api/v1/cards/:id/members/batch`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot add card members)

**Path Parameters:**
- `id` (integer) - Card ID

**Request Body (using user IDs):**
```json
{
  "userIds": [2, 3, 4]
}
```

**Request Body (using emails):**
```json
{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

**Request Validation:**
- `userIds` (array of integers, optional) - Array of user IDs
- `emails` (array of strings, optional) - Array of user emails
- Either `userIds` or `emails` must be provided

**Response:**
```json
[
  {
    "id": 3,
    "card_id": 1,
    "user_id": 2,
    "role": "member",
    "assigned_at": "2024-01-05T16:30:00.000Z",
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "avatar_url": null
  },
  {
    "id": 4,
    "card_id": 1,
    "user_id": 3,
    "role": "member",
    "assigned_at": "2024-01-05T16:30:00.000Z",
    "username": "jane_smith",
    "email": "jane@example.com",
    "full_name": "Jane Smith",
    "avatar_url": null
  }
]
```

**Error Responses:**
- `404` - Card or user not found
- `403` - Observers cannot add card members or user must be a member of board first
- `400` - Validation error

**Note:** Users who are already members of the card are not added again.

---

## Label API

### Get Board Labels

Get all labels available for a specific board.

**Endpoint:** `GET /api/v1/boards/:boardId/labels`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `boardId` (integer) - Board ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "Urgent",
    "color": "#ef4444",
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Feature",
    "color": "#3b82f6",
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `403` - You are not a member of this board

---

### Create Label

Create a new label for a board.

**Endpoint:** `POST /api/v1/boards/:boardId/labels`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot create labels)

**Path Parameters:**
- `boardId` (integer) - Board ID

**Request Body (using hex color):**
```json
{
  "name": "Important",
  "color": "#f59e0b"
}
```

**Request Body (using predefined color):**
```json
{
  "name": "Important",
  "color": "orange"
}
```

**Request Validation:**
- `name` (string, required, 1-50 characters) - Label name
- `color` (string, required) - Hex color code (#RRGGBB) or predefined color name

**Predefined Colors:**
- `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo`, `purple`, `pink`, `gray`

**Response:**
```json
{
  "id": 3,
  "name": "Important",
  "color": "#f59e0b",
  "board_id": 1,
  "created_at": "2024-01-05T17:00:00.000Z"
}
```

**Error Responses:**
- `403` - Observers cannot create labels
- `400` - Invalid color or validation error

---

### Update Label

Update an existing label.

**Endpoint:** `PUT /api/v1/boards/:boardId/labels/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot update labels)

**Path Parameters:**
- `boardId` (integer) - Board ID
- `id` (integer) - Label ID

**Request Body:**
```json
{
  "name": "Updated Label",
  "color": "#10b981"
}
```

**Request Validation:**
- `name` (string, optional, 1-50 characters) - New label name
- `color` (string, optional) - New hex color code or predefined color name

**Response:**
```json
{
  "id": 3,
  "name": "Updated Label",
  "color": "#10b981",
  "board_id": 1,
  "created_at": "2024-01-05T17:00:00.000Z"
}
```

**Error Responses:**
- `404` - Label not found
- `403` - Observers cannot update labels
- `400` - Invalid color or validation error

---

### Delete Label

Delete a label from a board.

**Endpoint:** `DELETE /api/v1/boards/:boardId/labels/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot delete labels)

**Path Parameters:**
- `boardId` (integer) - Board ID
- `id` (integer) - Label ID

**Response:**
```json
{
  "message": "Label deleted successfully"
}
```

**Error Responses:**
- `404` - Label not found
- `403` - Observers cannot delete labels

**Note:** Deleting a label will cascade delete it from all cards.

---

### Get Card Labels

Get all labels assigned to a specific card.

**Endpoint:** `GET /api/v1/cards/:id/labels`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `id` (integer) - Card ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "Urgent",
    "color": "#ef4444",
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 3,
    "name": "Important",
    "color": "#f59e0b",
    "board_id": 1,
    "created_at": "2024-01-05T17:00:00.000Z"
  }
]
```

**Error Responses:**
- `404` - Card not found
- `403` - You are not a member of this board

---

### Assign Label to Card

Assign a label to a card.

**Endpoint:** `POST /api/v1/cards/:id/labels`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot assign labels)

**Path Parameters:**
- `id` (integer) - Card ID

**Request Body:**
```json
{
  "labelId": 1
}
```

**Request Validation:**
- `labelId` (integer, required, > 0) - Label ID to assign

**Response:**
```json
[
  {
    "id": 1,
    "name": "Urgent",
    "color": "#ef4444",
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `404` - Card or label not found
- `403` - Observers cannot assign labels
- `400` - Label does not belong to this board

---

### Remove Label from Card

Remove a label from a card.

**Endpoint:** `DELETE /api/v1/cards/:id/labels/:labelId`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot remove labels)

**Path Parameters:**
- `id` (integer) - Card ID
- `labelId` (integer) - Label ID to remove

**Response:**
```json
{
  "message": "Label removed successfully"
}
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot remove labels

---

### Batch Update Card Labels

Replace all labels on a card with a new set.

**Endpoint:** `PUT /api/v1/cards/:id/labels`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot update labels)

**Path Parameters:**
- `id` (integer) - Card ID

**Request Body:**
```json
{
  "labelIds": [1, 3, 5]
}
```

**Request Validation:**
- `labelIds` (array of integers, required) - Array of label IDs

**Response:**
```json
[
  {
    "id": 1,
    "name": "Urgent",
    "color": "#ef4444",
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 3,
    "name": "Important",
    "color": "#f59e0b",
    "board_id": 1,
    "created_at": "2024-01-05T17:00:00.000Z"
  }
]
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot update labels
- `400` - Validation error

---

## Checklist API

### Get Card Checklists

Get all checklists for a card with progress percentages.

**Endpoint:** `GET /api/v1/cards/:cardId/checklists`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `cardId` (integer) - Card ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "To-do list",
    "card_id": 1,
    "position": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "total_items": 3,
    "completed_items": 1,
    "progress": 33,
    "items": [
      {
        "id": 1,
        "checklist_id": 1,
        "name": "Task 1",
        "completed": false,
        "position": 0,
        "completed_at": null
      },
      {
        "id": 2,
        "checklist_id": 1,
        "name": "Task 2",
        "completed": true,
        "position": 1,
        "completed_at": "2024-01-02T10:00:00.000Z"
      }
    ]
  }
]
```

**Error Responses:**
- `404` - Card not found
- `403` - You are not a member of this board

---

### Create Checklist

Create a new checklist in a card.

**Endpoint:** `POST /api/v1/cards/:cardId/checklists`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot create checklists)

**Path Parameters:**
- `cardId` (integer) - Card ID

**Request Body:**
```json
{
  "name": "New Checklist",
  "position": 0
}
```

**Request Validation:**
- `name` (string, required, 1-100 characters) - Checklist name
- `position` (integer, optional, ≥ 0) - Checklist position. If not provided, appended to end

**Response:**
```json
{
  "id": 2,
  "name": "New Checklist",
  "card_id": 1,
  "position": 1,
  "created_at": "2024-01-05T18:00:00.000Z"
}
```

**Error Responses:**
- `404` - Card not found
- `403` - Observers cannot create checklists
- `400` - Validation error

---

### Update Checklist

Update an existing checklist.

**Endpoint:** `PUT /api/v1/checklists/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot update checklists)

**Path Parameters:**
- `id` (integer) - Checklist ID

**Request Body:**
```json
{
  "name": "Updated Checklist",
  "position": 0
}
```

**Request Validation:**
- `name` (string, optional, 1-100 characters) - New checklist name
- `position` (integer, optional, ≥ 0) - New checklist position

**Response:**
```json
{
  "id": 2,
  "name": "Updated Checklist",
  "card_id": 1,
  "position": 0,
  "created_at": "2024-01-05T18:00:00.000Z"
}
```

**Error Responses:**
- `404` - Checklist not found
- `403` - Observers cannot update checklists
- `400` - Validation error

---

### Delete Checklist

Delete a checklist and all its items.

**Endpoint:** `DELETE /api/v1/checklists/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot delete checklists)

**Path Parameters:**
- `id` (integer) - Checklist ID

**Response:**
```json
{
  "message": "Checklist deleted successfully"
}
```

**Error Responses:**
- `404` - Checklist not found
- `403` - Observers cannot delete checklists

**Note:** Deleting a checklist will cascade delete all its items.

---

### Get Checklist Items

Get all items in a checklist.

**Endpoint:** `GET /api/v1/checklists/:checklistId/items`

**Authentication:** Required

**Authorization:** User must be a member or owner of the board

**Path Parameters:**
- `checklistId` (integer) - Checklist ID

**Response:**
```json
[
  {
    "id": 1,
    "checklist_id": 1,
    "name": "Task 1",
    "completed": false,
    "position": 0,
    "completed_at": null
  },
  {
    "id": 2,
    "checklist_id": 1,
    "name": "Task 2",
    "completed": true,
    "position": 1,
    "completed_at": "2024-01-02T10:00:00.000Z"
  }
]
```

---

### Create Checklist Item

Create a new item in a checklist.

**Endpoint:** `POST /api/v1/checklists/:checklistId/items`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot create checklist items)

**Path Parameters:**
- `checklistId` (integer) - Checklist ID

**Request Body:**
```json
{
  "name": "New Task",
  "position": 2
}
```

**Request Validation:**
- `name` (string, required, 1-200 characters) - Item name
- `position` (integer, optional, ≥ 0) - Item position. If not provided, appended to end

**Response:**
```json
{
  "id": 4,
  "checklist_id": 1,
  "name": "New Task",
  "completed": false,
  "position": 2,
  "completed_at": null
}
```

**Error Responses:**
- `404` - Checklist or card not found
- `403` - Observers cannot create checklist items
- `400` - Validation error

---

### Update Checklist Item

Update an existing checklist item.

**Endpoint:** `PUT /api/v1/checklist-items/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot update checklist items)

**Path Parameters:**
- `id` (integer) - Checklist Item ID

**Request Body:**
```json
{
  "name": "Updated Task",
  "completed": true,
  "position": 0
}
```

**Request Validation:**
- `name` (string, optional, 1-200 characters) - New item name
- `completed` (boolean, optional) - Mark as completed/uncompleted
- `position` (integer, optional, ≥ 0) - New item position

**Response:**
```json
{
  "id": 4,
  "checklist_id": 1,
  "name": "Updated Task",
  "completed": true,
  "position": 0,
  "completed_at": "2024-01-05T19:00:00.000Z"
}
```

**Error Responses:**
- `404` - Checklist Item, checklist, or card not found
- `403` - Observers cannot update checklist items
- `400` - Validation error

**Note:** When `completed` is set to `true`, `completed_at` is automatically set to current timestamp. When set to `false`, `completed_at` is set to `null`.

---

### Delete Checklist Item

Delete a checklist item.

**Endpoint:** `DELETE /api/v1/checklist-items/:id`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot delete checklist items)

**Path Parameters:**
- `id` (integer) - Checklist Item ID

**Response:**
```json
{
  "message": "Item deleted successfully"
}
```

**Error Responses:**
- `404` - Checklist Item, checklist, or card not found
- `403` - Observers cannot delete checklist items

---

### Reorder Checklist Items

Reorder all items in a checklist.

**Endpoint:** `PUT /api/v1/checklists/:checklistId/items/reorder`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot reorder checklist items)

**Path Parameters:**
- `checklistId` (integer) - Checklist ID

**Request Body:**
```json
{
  "itemIds": [3, 1, 2, 4]
}
```

**Request Validation:**
- `itemIds` (array of integers, required, min 1) - Array of item IDs in new order

**Response:**
```json
[
  {
    "id": 3,
    "checklist_id": 1,
    "name": "Task 3",
    "completed": false,
    "position": 0,
    "completed_at": null
  },
  {
    "id": 1,
    "checklist_id": 1,
    "name": "Task 1",
    "completed": false,
    "position": 1,
    "completed_at": null
  }
]
```

**Error Responses:**
- `404` - Checklist, card, or item not found
- `403` - Observers cannot reorder checklist items
- `400` - Validation error

---

### Batch Create Checklist Items

Create multiple items in a checklist at once.

**Endpoint:** `POST /api/v1/checklists/:checklistId/items/batch`

**Authentication:** Required

**Authorization:** Member or Admin (Observers cannot create checklist items)

**Path Parameters:**
- `checklistId` (integer) - Checklist ID

**Request Body:**
```json
{
  "items": [
    {
      "name": "Task 1"
    },
    {
      "name": "Task 2",
      "position": 1
    }
  ]
}
```

**Request Validation:**
- `items` (array, required, min 1) - Array of items to create
  - `name` (string, required, 1-200 characters) - Item name
  - `position` (integer, optional, ≥ 0) - Item position

**Response:**
```json
[
  {
    "id": 5,
    "checklist_id": 1,
    "name": "Task 1",
    "completed": false,
    "position": 0,
    "completed_at": null
  },
  {
    "id": 6,
    "checklist_id": 1,
    "name": "Task 2",
    "completed": false,
    "position": 1,
    "completed_at": null
  }
]
```

**Error Responses:**
- `404` - Checklist or card not found
- `403` - Observers cannot create checklist items
- `400` - Validation error

---

## Database Schema

### cards
```sql
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    board_id INTEGER NOT NULL,
    column_id INTEGER NOT NULL,
    due_date TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### card_members
```sql
CREATE TABLE card_members (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_card_user UNIQUE (card_id, user_id)
);
```

### labels
```sql
CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    board_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### card_labels
```sql
CREATE TABLE card_labels (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL,
    label_id INTEGER NOT NULL,
    CONSTRAINT unique_card_label UNIQUE (card_id, label_id)
);
```

### checklists
```sql
CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    card_id INTEGER NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### checklist_items
```sql
CREATE TABLE checklist_items (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0,
    completed_at TIMESTAMP
);
```

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
| View cards | ✅ | ✅ | ✅ |
| Create card | ✅ | ✅ | ❌ |
| Update card | ✅ | ✅ | ❌ |
| Delete card | ✅ | ✅ | ❌ |
| Move card | ✅ | ✅ | ❌ |
| Duplicate card | ✅ | ✅ | ❌ |
| Archive card | ✅ | ✅ | ❌ |
| Add card members | ✅ | ✅ | ❌ |
| Remove card members | ✅ | ✅ | ❌ |
| Create label | ✅ | ✅ | ❌ |
| Update label | ✅ | ✅ | ❌ |
| Delete label | ✅ | ✅ | ❌ |
| Assign labels | ✅ | ✅ | ❌ |
| Create checklist | ✅ | ✅ | ❌ |
| Update checklist | ✅ | ✅ | ❌ |
| Delete checklist | ✅ | ✅ | ❌ |
| Create checklist items | ✅ | ✅ | ❌ |
| Update checklist items | ✅ | ✅ | ❌ |
| Delete checklist items | ✅ | ✅ | ❌ |

---

## Example Usage

### cURL Examples

**Get card with full details:**
```bash
curl -X GET "http://localhost:5000/api/v1/cards/1" \
  -b cookies.txt
```

**Create a card:**
```bash
curl -X POST "http://localhost:5000/api/v1/columns/1/cards" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "New Task",
    "description": "Task description",
    "due_date": "2024-01-20T18:00:00Z"
  }'
```

**Move card:**
```bash
curl -X PUT "http://localhost:5000/api/v1/cards/1/move" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "target_column_id": 2,
    "position": 0
  }'
```

**Add member to card:**
```bash
curl -X POST "http://localhost:5000/api/v1/cards/1/members" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "email": "user@example.com"
  }'
```

**Create label:**
```bash
curl -X POST "http://localhost:5000/api/v1/boards/1/labels" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Urgent",
    "color": "#ef4444"
  }'
```

**Create checklist:**
```bash
curl -X POST "http://localhost:5000/api/v1/cards/1/checklists" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "To-do list"
  }'
```

**Batch create checklist items:**
```bash
curl -X POST "http://localhost:5000/api/v1/checklists/1/items/batch" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "items": [
      {"name": "Task 1"},
      {"name": "Task 2"},
      {"name": "Task 3"}
    ]
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format
- Card positions are 0-indexed
- `is_overdue` is automatically calculated (due_date < NOW() AND completed = FALSE)
- When completing a checklist item, `completed_at` is automatically set
- Label colors support both hex codes (#RRGGBB) and predefined color names
- Checklist progress is calculated as: `(completed_items / total_items) * 100`
- Duplicating a card copies checklists, items, and labels, but NOT members
- Card movement between different boards is not supported
- `completed_at` timestamp is set when a card is marked as completed
