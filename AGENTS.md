# AGENTS.md

## Build Commands

### Client (client/ directory)

```bash
cd client
yarn dev              # Start development server (Vite)
yarn build            # Build for production (tsc && vite build)
yarn typecheck        # Run TypeScript type checking
yarn lint             # Run ESLint
yarn lint:fix         # Run ESLint with auto-fix
yarn format           # Run Prettier to format code
yarn format:check     # Check code formatting with Prettier
yarn preview          # Preview production build
```

### Server (server/ directory)

```bash
cd server
yarn dev              # Start development server with hot-reload (nodemon + ts-node)
yarn build            # Build TypeScript to JavaScript (tsc)
yarn start            # Start production server (runs from dist/)
```

### Testing

No tests are currently configured in this project. If adding tests, check with the user for the preferred testing framework (Jest, Vitest, etc.) before implementation.

## Code Style Guidelines

### Imports

- Use ES6 import syntax with named imports: `import { useState } from 'react';`
- Use default imports for default exports: `import api from '../lib/api';`
- Separate type imports explicitly: `import type { Board } from '../types';`
- Group imports: external libraries first, then internal modules, then type imports

### Formatting (Prettier)

- Semi-colons: required
- Trailing commas: es6
- Quotes: single quotes
- Max line width: 100 characters
- Indentation: 2 spaces (no tabs)
- Arrow function parentheses: always

### Naming Conventions

- **Components**: PascalCase (`BoardsPage.tsx`, `DashboardLayout.tsx`)
- **Functions/Variables**: camelCase (`fetchBoards`, `boards`)
- **Constants**: UPPER_SNAKE_CASE (`JWT_SECRET`, `API_BASE_URL`)
- **Interfaces/Types**: PascalCase (`Board`, `Column`, `Card`)
- **Classes**: PascalCase (`JWTUtil`)
- **Files**: PascalCase for components (`App.tsx`), kebab-case for utilities/pages if applicable

### Types and TypeScript

- TypeScript strict mode is enabled
- Explicitly type function parameters: `async (req: Request, res: Response)`
- Export interfaces for reusable types: `export interface Board { ... }`
- Use `import type` for type-only imports
- Prefer interfaces over type aliases for object shapes (use type for unions/intersections)
- Server: Use commonjs module system
- Client: Use ESNext module system with path alias `@/*` for `./src/*`

### Components

- Use functional components with hooks
- Define props interfaces inline or in types folder: `interface Props { ... }`
- Export as default: `export default function ComponentName()`
- Use Tailwind CSS classes for styling
- Utilize Shadcn UI components from `@/components/ui`
- Helper function: `cn()` from `@/lib/utils` for conditional class merging

### Server/API

- Use Express Router for route definitions: `router.get('/path', handler)`
- Async route handlers with try-catch error handling
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Use parameterized queries: `pool.query('SELECT * WHERE id = $1', [id])`
- Environment variables via `process.env` (use dotenv)
- JWT utilities for authentication

### Error Handling

- Wrap async operations in try-catch blocks
- Log errors: `console.error('Error message:', error)`
- Return error responses: `res.status(500).json({ error: 'Message' })`
- Client: Error state management with try-catch-finally

### SQL/Database

- Migrations in `server/src/migrations/`
- Use numbered prefixes: `001_init.sql`, `002_full_schema.sql`
- Parameterized queries with `$1`, `$2` syntax
- Connection pooling via `pg` library (pool instance in `db.ts`)

### Additional Notes

- React Router v7 for client routing
- State management with React hooks (useState, useEffect)
- API client via Axios with base URL configuration
- PostgreSQL with pg driver
- Shadcn UI components in `client/src/components/ui/`
- Type definitions in `client/src/types/` and `server/src/types/`
