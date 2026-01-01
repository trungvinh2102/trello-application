# Trello Application

A full-featured Trello-like application with user management, boards, cards, labels, checklists, comments, attachments, and activity tracking.

This project uses **Yarn Workspaces** to manage shared dependencies between frontend and backend.

## Tech Stack

### Client

- React 19 with TypeScript
- React Router v7
- Shadcn UI
- TailwindCSS v4
- React DND Kit
- Vite
- Yarn Workspaces
- Docker support

### Server

- Node.js
- Express.js
- PostgreSQL 16
- TypeScript
- Docker support

## Project Structure

```
opencode-monorepo/
├── client/                        # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── SortableColumn.tsx
│   │   ├── pages/                 # Page components
│   │   │   ├── BoardsPage.tsx
│   │   │   ├── BoardDetailPage.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Team.tsx
│   │   ├── lib/                   # Utilities & API
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── types/                 # TypeScript types
│   │   └── main.tsx
│   ├── Dockerfile                 # Production Dockerfile
│   ├── Dockerfile.dev             # Development Dockerfile
│   ├── nginx.conf                 # Nginx configuration
│   └── package.json
├── server/                        # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/                # API routes
│   │   │   └── boards.ts
│   │   ├── migrations/            # Database migrations
│   │   │   ├── 001_init.sql       # Initial schema
│   │   │   ├── 002_full_schema.sql # Complete Trello schema
│   │   │   └── 003_add_refresh_tokens.sql
│   │   ├── db.ts                  # Database connection
│   │   └── index.ts
│   ├── Dockerfile                 # Production Dockerfile
│   ├── Dockerfile.dev             # Development Dockerfile
│   └── package.json
├── node_modules/                 # Shared dependencies
└── package.json                  # Root workspace configuration
```

## Shared Dependencies

The following dependencies are managed at the root level and shared between client and server:

- `typescript@^5.9.3`
- `@types/node@^25.0.3`

## Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Yarn (v1.22 or higher)

### Install Dependencies

```bash
# Install all dependencies (runs from root)
yarn install
```

## Development

### Start Both Client and Server

```bash
# Start both frontend and backend simultaneously
yarn dev
```

This will start:
- Frontend on `http://localhost:5173` (or next available port)
- Backend on `http://localhost:3000`

### Start Individual Services

```bash
# Start only client
yarn dev:client

# Start only server
yarn dev:server
```

## Available Scripts

### Root Scripts

- `yarn install:all` - Install all dependencies
- `yarn dev` - Start both frontend and backend simultaneously
- `yarn dev:client` - Start only frontend
- `yarn dev:server` - Start only backend
- `yarn build` - Build all packages
- `yarn build:client` - Build frontend only
- `yarn build:server` - Build backend only
- `yarn start:server` - Start production server
- `yarn typecheck` - Type check all packages
- `yarn typecheck:client` - Type check client only
- `yarn lint` - Lint all packages
- `yarn lint:fix` - Lint and fix all packages
- `yarn format` - Format all packages
- `yarn format:check` - Check formatting of all packages

### Workspace Scripts

You can also run scripts on individual workspaces:

```bash
# Run a script in a specific workspace
yarn workspace <workspace-name> <script>

# Examples:
yarn workspace client dev
yarn workspace server build
```

### Client (in client/ directory)

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn typecheck` - Run TypeScript type checking
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Run ESLint with auto-fix
- `yarn format` - Run Prettier to format code
- `yarn format:check` - Check code formatting
- `yarn preview` - Preview production build

### Server (in server/ directory)

- `yarn dev` - Start development server with auto-reload
- `yarn build` - Build TypeScript to JavaScript
- `yarn start` - Start production server

### Docker

- `docker-compose up -d` - Start production services
- `docker-compose -f docker-compose.dev.yml up -d` - Start development services
- `docker-compose down` - Stop services
- `docker-compose logs -f` - View logs

## Working with Workspaces

### List Workspaces

```bash
yarn workspaces info
```

### Add Dependency to a Specific Workspace

```bash
# Add to client
yarn workspace client add <package-name>

# Add to server
yarn workspace server add <package-name>
```

### Add Dependency to Root (Shared)

```bash
yarn add -W <package-name>
```

## Features

### Core Features

- ✅ User authentication & authorization
- ✅ Board management with 3 visibility levels (private, workspace, public)
- ✅ Column management with drag & drop
- ✅ Card management with due dates
- ✅ Member management with role-based access (admin, member, observer)
- ✅ Labels/tags system with colors
- ✅ Checklists with progress tracking
- ✅ Comments on cards
- ✅ File attachments
- ✅ Activity audit log
- ✅ Real-time dashboard analytics

### Advanced Features

- Role-based permissions
- Multi-tenant support
- Activity tracking with JSON details
- Optimized queries with indexes
- Production-ready with Docker

## Database Schema

### Core Tables

- **users**: User accounts with authentication
- **boards**: Projects with visibility settings
- **board_members**: Board membership with roles
- **columns**: Lists/columns within boards
- **cards**: Tasks with due dates and positions
- **refresh_tokens**: JWT refresh tokens for authentication

### Feature Tables

- **card_members**: Assignments
- **labels**: Color-coded tags
- **card_labels**: Label associations
- **checklists**: Task checklists
- **checklist_items**: Checklist items
- **comments**: Card discussions
- **attachments**: File uploads
- **activities**: Activity audit log

## Setup Instructions

### Option 1: Docker (Recommended)

#### Production Build

```bash
# Start all services (PostgreSQL, Server, Client)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

#### Development Mode

```bash
# Start development environment with hot-reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

### Option 2: Local Development

#### Database Setup

1. Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE trello_system;
\q
```

2. Run complete schema migration:

```bash
cd server
psql -U postgres -d trello_system -f src/migrations/002_full_schema.sql
```

This will create all tables with sample data.

#### Server Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
yarn install
```

3. Update `.env` file:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/trello_system
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret
```

4. Start server:

```bash
yarn dev
```

The server will run on `http://localhost:3000`

#### Client Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
yarn install
```

3. Update `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:

```bash
yarn dev
```

The client will run on `http://localhost:5173`

## Pages

- `/` - Dashboard with analytics
- `/boards` - Boards listing page
- `/boards/:id` - Individual board with columns and cards
- `/analytics` - Analytics dashboard with statistics
- `/projects` - Projects management with progress tracking
- `/team` - Team member management

## API Endpoints

### Boards

- `GET /api/health` - Health check
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get a specific board with columns and cards
- `POST /api/boards` - Create a new board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

### Users

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/users/:id` - Get user profile

### Columns

- `GET /api/columns/:boardId` - Get columns for a board
- `POST /api/columns` - Create a new column
- `PUT /api/columns/:id` - Update a column
- `DELETE /api/columns/:id` - Delete a column

### Cards

- `GET /api/cards/:columnId` - Get cards for a column
- `POST /api/cards` - Create a new card
- `PUT /api/cards/:id` - Update a card
- `DELETE /api/cards/:id` - Delete a card

### Comments

- `GET /api/comments/:cardId` - Get comments for a card
- `POST /api/comments` - Add a comment

### Checklists

- `GET /api/checklists/:cardId` - Get checklists for a card
- `POST /api/checklists` - Create a checklist
- `PUT /api/checklist-items/:id` - Update checklist item

### Activities

- `GET /api/activities/:boardId` - Get activity log for a board

## Environment Variables

### Server (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/trello_system
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret
```

### Client (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Database Management

### Running Migrations

```bash
# Run all migrations
psql -U postgres -d trello_system -f server/src/migrations/002_full_schema.sql

# Reset database
psql -U postgres -d trello_system -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -U postgres -d trello_system -f server/src/migrations/002_full_schema.sql
```

### Accessing Database via Docker

```bash
# Connect to PostgreSQL container
docker exec -it trello_postgres psql -U trello_user -d trello_system

# Or use psql from host
psql -h localhost -p 5432 -U trello_user -d trello_system
```

## Troubleshooting

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View container logs
docker-compose logs -f [service_name]

# Remove all Docker data
docker-compose down -v
```

### Database Connection Issues

Make sure PostgreSQL is running and credentials are correct:

```bash
# Test connection
psql -h localhost -p 5432 -U username -d trello_system
```

### Port Already in Use

Change ports in docker-compose.yml or .env files:

```yaml
# In docker-compose.yml
services:
  postgres:
    ports:
      - "5433:5432" # Use 5433 instead of 5432
```

### Dependencies Not Found in Workspace

If you encounter "module not found" errors for shared dependencies:
1. Run `yarn install` from root
2. Restart your development server

### Vite Dev Server Errors

If you see errors like "Cannot find module" or "No loader is configured for .node files":
1. Clear all caches:
   ```bash
   rm -rf client/.vite
   rm -rf client/node_modules/.vite
   rm -rf node_modules/.cache
   ```
2. Reinstall dependencies: `yarn install`
3. Restart dev server

### React Router v7 + Vite Module Resolution Errors

If you see errors like:
- "The requested module '/@fs/... does not provide an export named 'parse'"
- Issues with `cookie` package imports

This is a known issue with React Router v7 and Vite in a monorepo. The project uses Vite 7 with React Router v7, which has a dependency on `cookie` package that uses native Node.js modules.

**Current workaround:**
1. Clear all caches:
   ```bash
   rm -rf client/.vite
   rm -rf client/node_modules/.vite
   rm -rf node_modules/.cache
   ```
2. Restart dev server: `yarn dev:client`

The `client/vite.config.ts` has been configured with:
- `resolve.dedupe` to dedupe React Router dependencies
- `optimizeDeps.noDiscovery: true` to disable dependency optimization
- `server.fs.strict: false` to relax file system restrictions

If the issue persists, try:
1. Clear browser cache and do a hard refresh (Ctrl+Shift+R)
2. Restart the development server
3. Delete the `.vite` folder in the client directory manually

### TypeScript Errors

After adding shared TypeScript types:
1. Restart TypeScript server in your IDE
2. Clear any cached TypeScript files

## License

MIT
