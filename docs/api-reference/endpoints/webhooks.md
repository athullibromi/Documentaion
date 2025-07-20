---
title: Webhooks API
description: API endpoints for managing webhooks and event notifications
category: api-reference
order: 3
tags: [api, webhooks, events, notifications]
---

# Webhooks API

The Webhooks API allows you to configure and manage webhook endpoints for receiving event notifications.

## Webhook Events

Our system can send notifications for the following events:

| Event Type | Description |
|------------|-------------|
| `user.created` | A new user has been created |
| `user.updated` | A user's information has been updated |
| `user.deleted` | A user has been deleted |
| `data.created` | A new data resource has been created |
| `data.updated` | A data resource has been updated |
| `data.deleted` | A data resource has been deleted |
| `report.generated` | A report has been generated |
| `system.alert` | A system alert has been triggered |

## Endpoints

### Get All Webhooks

```
GET /api/v1/webhooks
```

Retrieves a list of all configured webhooks.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number for pagination (default: 1) |
| `limit` | integer | Number of results per page (default: 20, max: 100) |
| `status` | string | Filter by webhook status (active, inactive) |
| `event` | string | Filter by event type |

#### Response

```json
{
  "data": [
    {
      "id": "wh_123456",
      "url": "https://example.com/webhooks/user-events",
      "events": ["user.created", "user.updated", "user.deleted"],
      "status": "active",
      "created_at": "2023-03-15T08:30:00Z",
      "last_triggered": "2023-06-20T14:22:10Z"
    },
    // More webhooks...
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### Get Webhook by ID

```
GET /api/v1/webhooks/{webhook_id}
```

Retrieves a specific webhook by ID.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `webhook_id` | string | The unique identifier of the webhook |

#### Response

```json
{
  "data": {
    "id": "wh_123456",
    "url": "https://example.com/webhooks/user-events",
    "events": ["user.created", "user.updated", "user.deleted"],
    "status": "active",
    "created_at": "2023-03-15T08:30:00Z",
    "updated_at": "2023-05-10T11:45:22Z",
    "last_triggered": "2023-06-20T14:22:10Z",
    "secret": "whsec_••••••••••••••••••••••••••••••",
    "description": "User events webhook for CRM integration"
  }
}
```

### Create Webhook

```
POST /api/v1/webhooks
```

Creates a new webhook endpoint.

#### Request Body

```json
{
  "url": "https://example.com/webhooks/data-events",
  "events": ["data.created", "data.updated", "data.deleted"],
  "description": "Data events webhook for analytics platform"
}
```

#### Response

```json
{
  "data": {
    "id": "wh_789012",
    "url": "https://example.com/webhooks/data-events",
    "events": ["data.created", "data.updated", "data.deleted"],
    "status": "active",
    "created_at": "2023-06-21T09:15:30Z",
    "secret": "whsec_abcdefghijklmnopqrstuvwxyz1234",
    "description": "Data events webhook for analytics platform"
  }
}
```

### Update Webhook

```
PUT /api/v1/webhooks/{webhook_id}
```

Updates an existing webhook.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `webhook_id` | string | The unique identifier of the webhook |

#### Request Body

```json
{
  "events": ["data.created", "data.updated"],
  "status": "inactive",
  "description": "Data creation and update events only"
}
```

#### Response

```json
{
  "data": {
    "id": "wh_789012",
    "url": "https://example.com/webhooks/data-events",
    "events": ["data.created", "data.updated"],
    "status": "inactive",
    "created_at": "2023-06-21T09:15:30Z",
    "updated_at": "2023-06-21T10:22:15Z",
    "description": "Data creation and update events only"
  }
}
```

### Delete Webhook

```
DELETE /api/v1/webhooks/{webhook_id}
```

Deletes a webhook.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `webhook_id` | string | The unique identifier of the webhook |

#### Response

```json
{
  "success": true,
  "message": "Webhook deleted successfully"
}
```

### Test Webhook

```
POST /api/v1/webhooks/{webhook_id}/test
```

Sends a test event to the webhook endpoint.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `webhook_id` | string | The unique identifier of the webhook |

#### Request Body

```json
{
  "event": "user.created"
}
```

#### Response

```json
{
  "success": true,
  "message": "Test event sent successfully",
  "details": {
    "status_code": 200,
    "response_time": 342,
    "timestamp": "2023-06-21T10:30:15Z"
  }
}
```

## Webhook Payload Format

When an event occurs, we'll send a POST request to your webhook URL with the following payload format:

```json
{
  "id": "evt_123456",
  "type": "user.created",
  "created": "2023-06-21T09:15:30Z",
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

## Webhook Security

All webhook requests include a signature in the `X-Webhook-Signature` header. This signature is a HMAC SHA-256 hash of the request body using your webhook secret as the key.

Example code to verify the signature:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Webhook does not exist |
| 422 | Unprocessable Entity - Invalid webhook URL |
| 429 | Too Many Requests - Rate limit exceeded |

## Related Resources

- [Authentication](/api-reference/authentication)
- [Users API](/api-reference/endpoints/users)
- [Data API](/api-reference/endpoints/data)