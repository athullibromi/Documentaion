---
title: Data API
description: API endpoints for managing data resources
category: api-reference
order: 2
tags: [api, data, resources]
---

# Data API

The Data API allows you to manage data resources programmatically.

## Endpoints

### Get All Data Resources

```
GET /api/v1/data
```

Retrieves a list of all data resources.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number for pagination (default: 1) |
| `limit` | integer | Number of results per page (default: 20, max: 100) |
| `type` | string | Filter by resource type |
| `status` | string | Filter by status (active, archived, draft) |
| `created_after` | string | ISO date to filter by creation date |

#### Response

```json
{
  "data": [
    {
      "id": "res_123456",
      "name": "Monthly Sales Report",
      "type": "report",
      "status": "active",
      "created_at": "2023-05-15T08:30:00Z",
      "updated_at": "2023-06-01T14:22:10Z"
    },
    // More resources...
  ],
  "meta": {
    "total": 67,
    "page": 1,
    "limit": 20,
    "pages": 4
  }
}
```

### Get Data Resource by ID

```
GET /api/v1/data/{resource_id}
```

Retrieves a specific data resource by ID.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource_id` | string | The unique identifier of the resource |

#### Response

```json
{
  "data": {
    "id": "res_123456",
    "name": "Monthly Sales Report",
    "type": "report",
    "status": "active",
    "created_at": "2023-05-15T08:30:00Z",
    "updated_at": "2023-06-01T14:22:10Z",
    "content": {
      "fields": ["date", "product", "quantity", "revenue"],
      "format": "csv",
      "size": 24680,
      "last_processed": "2023-06-01T14:20:05Z"
    },
    "metadata": {
      "owner": "usr_789012",
      "department": "Sales",
      "tags": ["monthly", "sales", "report"]
    }
  }
}
```

### Create Data Resource

```
POST /api/v1/data
```

Creates a new data resource.

#### Request Body

```json
{
  "name": "Q2 Financial Summary",
  "type": "report",
  "content": {
    "fields": ["month", "department", "expenses", "revenue", "profit"],
    "format": "xlsx"
  },
  "metadata": {
    "department": "Finance",
    "tags": ["quarterly", "finance", "summary"]
  }
}
```

#### Response

```json
{
  "data": {
    "id": "res_789012",
    "name": "Q2 Financial Summary",
    "type": "report",
    "status": "draft",
    "created_at": "2023-06-21T09:15:30Z",
    "updated_at": "2023-06-21T09:15:30Z",
    "content": {
      "fields": ["month", "department", "expenses", "revenue", "profit"],
      "format": "xlsx"
    },
    "metadata": {
      "owner": "usr_123456",
      "department": "Finance",
      "tags": ["quarterly", "finance", "summary"]
    }
  }
}
```

### Update Data Resource

```
PUT /api/v1/data/{resource_id}
```

Updates an existing data resource.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource_id` | string | The unique identifier of the resource |

#### Request Body

```json
{
  "name": "Q2 Financial Summary - Updated",
  "status": "active",
  "metadata": {
    "department": "Finance",
    "tags": ["quarterly", "finance", "summary", "approved"]
  }
}
```

#### Response

```json
{
  "data": {
    "id": "res_789012",
    "name": "Q2 Financial Summary - Updated",
    "type": "report",
    "status": "active",
    "created_at": "2023-06-21T09:15:30Z",
    "updated_at": "2023-06-21T10:22:15Z",
    "content": {
      "fields": ["month", "department", "expenses", "revenue", "profit"],
      "format": "xlsx"
    },
    "metadata": {
      "owner": "usr_123456",
      "department": "Finance",
      "tags": ["quarterly", "finance", "summary", "approved"]
    }
  }
}
```

### Delete Data Resource

```
DELETE /api/v1/data/{resource_id}
```

Deletes a data resource.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `resource_id` | string | The unique identifier of the resource |

#### Response

```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Resource name already in use |
| 413 | Payload Too Large - Resource size exceeds limit |
| 429 | Too Many Requests - Rate limit exceeded |

## Related Resources

- [Authentication](/api-reference/authentication)
- [Users API](/api-reference/endpoints/users)
- [Webhooks API](/api-reference/endpoints/webhooks)