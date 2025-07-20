---
title: Authentication
description: Learn how to authenticate with our API
category: api-reference
order: 1
tags: [api, authentication, security]
---

# Authentication

Our API uses token-based authentication to secure your requests.

## Getting Your API Key

1. Log into your dashboard
2. Navigate to Settings > API Keys
3. Click "Generate New Key"
4. Copy and store your key securely

## Making Authenticated Requests

Include your API key in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.example.com/v1/data
```

## Authentication Errors

Common authentication errors and solutions:

### 401 Unauthorized

This means your API key is invalid or missing.

### 403 Forbidden

Your API key is valid but doesn't have permission for this resource.