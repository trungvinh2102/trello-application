# Configs

This directory contains application configuration files.

## Files

### `domain.config.ts`
- Domain and base URL configuration
- Environment-specific domain settings
- Used for API endpoints and application routing

### `api.config.ts`
- API endpoints configuration
- Request configuration (timeout, headers, etc.)
- Centralized endpoint definitions for all API routes

### `index.ts`
- Exports all configurations for easy importing

## Usage

```typescript
import { API_CONFIG, ENDPOINTS, DOMAIN_CONFIG } from '@/configs';

// Get API base URL
console.log(API_CONFIG.BASE_URL);

// Use specific endpoint
const url = ENDPOINTS.GET_BOARD('board-123');

// Get domain configuration
console.log(DOMAIN_CONFIG.API_URL);
```

## Environment Variables

- `VITE_API_URL`: API domain URL without `/api` (default: http://localhost:5000)
- `VITE_BASE_URL`: Application base URL (default: /)
