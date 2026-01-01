# Trello Application

A full-featured Trello-like application with user management, boards, cards, labels, checklists, comments, attachments, and activity tracking.

## Tech Stack

### Client
- React 19 with TypeScript
- React Router v7
- Shadcn UI
- TailwindCSS v4
- React DND Kit
- Vite
- Yarn
- Docker support

### Server
- Node.js
- Express.js
- PostgreSQL 16
- TypeScript
- Docker support

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

## Project Structure

```
trello-app/
├── client/                        # React + TypeScript frontend
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── SortableColumn.tsx
│   │   ├── pages/                 # Page components
│   │   │   ├── BoardsPage.tsx
│   │   │   ├── BoardDetailPage.tsx
│   │   │   └── Dashboard.tsx      # Dashboard-01 analytics
│   │   ├── lib/                   # Utilities & API
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── types/                 # TypeScript types
│   │   │   ├── index.ts
│   │   │   └── dashboard.ts
│   │   └── main.tsx
│   ├── Dockerfile                 # Production Dockerfile
│   ├── Dockerfile.dev             # Development Dockerfile
│   ├── nginx.conf                 # Nginx configuration
│   └── .dockerignore
├── server/                        # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/                # API routes
│   │   │   └── boards.ts
│   │   ├── migrations/            # Database migrations
│   │   │   ├── 001_init.sql       # Initial schema
│   │   │   └── 002_full_schema.sql # Complete Trello schema
│   │   ├── db.ts                  # Database connection
│   │   └── index.ts
│   ├── Dockerfile                 # Production Dockerfile
│   ├── Dockerfile.dev             # Development Dockerfile
│   └── .dockerignore
├── docker-compose.yml              # Production Docker Compose
├── docker-compose.dev.yml          # Development Docker Compose
└── README.md
```

## Database Schema

### Core Tables
- **users**: User accounts with authentication
- **boards**: Projects with visibility settings
- **board_members**: Board membership with roles
- **columns**: Lists/columns within boards
- **cards**: Tasks with due dates and positions

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

#### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Yarn

#### Database Setup

1. Create a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE trello_system;
\q
```

2. Run the complete schema migration:
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
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/trello_system
CORS_ORIGIN=http://localhost:5173
```

4. Start the server:
```bash
yarn dev
```

The server will run on `http://localhost:5000`

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
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
yarn dev
```

The client will run on `http://localhost:5173`

## Available Scripts

### Client (in client/ directory)
- `yarn dev` - Start development server
- `yarn build` - Build for production
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

## Dashboard Features

The Dashboard-01 includes:
- Overview statistics (Total Boards, Columns, Cards, Active Cards)
- Board distribution visualization
- Recent activity feed
- Quick navigation to boards
- Collapsible sidebar

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

## Pages

- `/` - Boards listing page
- `/dashboard` - Analytics dashboard with statistics
- `/boards/:id` - Individual board with columns and cards

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

## Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/trello_system
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
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
      - "5433:5432"  # Use 5433 instead of 5432
```

## License

MIT
