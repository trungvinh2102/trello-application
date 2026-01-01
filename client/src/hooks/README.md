# useAxios Hook

Custom hook for handling HTTP requests with automatic interceptors for authentication and error handling.

## Features

- Automatic JWT token injection from localStorage
- Request/Response interceptors
- Automatic token refresh on 401 errors
- Type-safe request methods
- Centralized error handling

## Usage

### Basic Usage

```typescript
import { useAxios } from '@/hooks';

function MyComponent() {
  const { get, post, put, del, patch } = useAxios();

  const fetchData = async () => {
    try {
      const data = await get('/boards');
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createData = async () => {
    try {
      const result = await post('/boards', { name: 'New Board' });
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <div>...</div>;
}
```

### With TypeScript Types

```typescript
interface Board {
  id: string;
  name: string;
  description?: string;
}

const { get } = useAxios();

const fetchBoard = async (id: string) => {
  const board = await get<Board>(`/boards/${id}`);
  return board;
};
```

### With Custom Config

```typescript
import { useAxios } from '@/hooks';

const { get } = useAxios();

const fetchData = async () => {
  const data = await get('/boards', {
    params: { page: 1, limit: 10 },
    headers: { 'X-Custom-Header': 'value' },
  });
};
```

## Methods

- `get<T>(url, config?)`: GET request
- `post<T>(url, data?, config?)`: POST request
- `put<T>(url, data?, config?)`: PUT request
- `patch<T>(url, data?, config?)`: PATCH request
- `del<T>(url, config?)`: DELETE request

## Token Management

The hook automatically:
1. Reads `accessToken` from localStorage and adds it to request headers
2. Intercepts 401 errors and attempts to refresh the token
3. Updates the stored tokens on successful refresh
4. Redirects to `/login` if refresh fails

## Error Handling

All errors are rejected and should be caught with try-catch:
- Network errors
- 401 Unauthorized (auto-handled for refresh)
- 4xx/5xx HTTP errors
- Timeout errors

## Note

The hook uses a singleton pattern to reuse the same Axios instance across the application, ensuring consistent interceptor behavior.
