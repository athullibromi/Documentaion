---
title: Users API
description: API endpoints for managing users
category: api-reference
order: 1
tags: [api, users, authentication]
---

# Users API

The Users API allows you to manage user accounts programmatically.

## Endpoints

### Get All Users

```
GET /api/v1/users
```

Retrieves a list of all users.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number for pagination (default: 1) |
| `limit` | integer | Number of results per page (default: 20, max: 100) |
| `status` | string | Filter by user status (active, inactive, pending) |
| `role` | string | Filter by user role |

#### Response

```json
{
  "data": [
    {
      "id": "usr_123456",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin",
      "status": "active",
      "created_at": "2023-01-15T08:30:00Z",
      "last_login": "2023-06-20T14:22:10Z"
    },
    // More users...
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

### Get User by ID

```
GET /api/v1/users/{user_id}
```

Retrieves a specific user by ID.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string | The unique identifier of the user |

#### Response

```json
{
  "data": {
    "id": "usr_123456",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin",
    "status": "active",
    "created_at": "2023-01-15T08:30:00Z",
    "last_login": "2023-06-20T14:22:10Z",
    "settings": {
      "theme": "light",
      "notifications": true
    }
  }
}
```

### Create User

```
POST /api/v1/users
```

Creates a new user.

#### Request Body

```json
{
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "role": "editor",
  "password": "securePassword123",
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

#### Response

```json
{
  "data": {
    "id": "usr_789012",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "role": "editor",
    "status": "pending",
    "created_at": "2023-06-21T09:15:30Z"
  }
}
```

### Update User

```
PUT /api/v1/users/{user_id}
```

Updates an existing user.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string | The unique identifier of the user |

#### Request Body

```json
{
  "name": "Jane Smith-Johnson",
  "role": "admin",
  "status": "active",
  "settings": {
    "theme": "system",
    "notifications": false
  }
}
```

#### Response

```json
{
  "data": {
    "id": "usr_789012",
    "email": "newuser@example.com",
    "name": "Jane Smith-Johnson",
    "role": "admin",
    "status": "active",
    "created_at": "2023-06-21T09:15:30Z",
    "updated_at": "2023-06-21T10:22:15Z"
  }
}
```

### Delete User

```
DELETE /api/v1/users/{user_id}
```

Deletes a user.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string | The unique identifier of the user |

#### Response

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - User does not exist |
| 409 | Conflict - Email already in use |
| 429 | Too Many Requests - Rate limit exceeded |

## Related Resources

- [Authentication](/api-reference/authentication)
- [Data API](/api-reference/endpoints/data)
- [Webhooks API](/api-reference/endpoints/webhooks)