# Docker Database Setup Guide

## Quick Start with Docker PostgreSQL

### 1. Start PostgreSQL container

```bash
# Start PostgreSQL using docker-compose
docker-compose up -d postgres

# Or with dev compose
docker-compose -f docker-compose.dev.yml up -d postgres
```

### 2. Check PostgreSQL status

```bash
# Check if container is running
docker ps | grep postgres

# View logs
docker-compose logs postgres

# Test connection
docker exec -it trello_postgres psql -U postgres -d trello_db -c "SELECT version();"
```

### 3. Configure Server .env

Create or update `server/.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trello_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
```

**Important:** If PostgreSQL is running in Docker but server is running locally, use `localhost:5432` as shown above.

### 4. Run Migrations

```bash
# Build server first
cd server
npm run build

# Run migrations using psql with Docker connection
psql "postgresql://postgres:postgres@localhost:5432/trello_db" -f dist/migrations/001_init.sql
psql "postgresql://postgres:postgres@localhost:5432/trello_db" -f dist/migrations/002_full_schema.sql
psql "postgresql://postgres:postgres@localhost:5432/trello_db" -f dist/migrations/003_add_refresh_tokens.sql
```

Or execute migrations directly inside Docker container:

```bash
docker exec -i trello_postgres psql -U postgres -d trello_db < server/dist/migrations/001_init.sql
docker exec -i trello_postgres psql -U postgres -d trello_db < server/dist/migrations/002_full_schema.sql
docker exec -i trello_postgres psql -U postgres -d trello_db < server/dist/migrations/003_add_refresh_tokens.sql
```

### 5. Start Server

```bash
cd server
npm run dev
```

## Full Docker Compose (Server + PostgreSQL)

If you want to run both server and PostgreSQL in Docker:

```bash
# Build and start all services
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (reset database)
docker-compose -f docker-compose.dev.yml down -v
```

## Docker Commands Reference

### PostgreSQL Management

```bash
# Connect to PostgreSQL inside container
docker exec -it trello_postgres psql -U postgres -d trello_db

# Backup database
docker exec trello_postgres pg_dump -U postgres trello_db > backup.sql

# Restore database
cat backup.sql | docker exec -i trello_postgres psql -U postgres -d trello_db

# List all databases
docker exec -it trello_postgres psql -U postgres -c "\l"

# List all tables
docker exec -it trello_postgres psql -U postgres -d trello_db -c "\dt"
```

### View Logs

```bash
# All containers
docker-compose logs -f

# PostgreSQL only
docker-compose logs -f postgres

# Server only
docker-compose logs -f server

# Last 100 lines
docker-compose logs --tail=100 postgres
```

### Troubleshooting

#### Connection Error: "SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"

**Cause:** DATABASE_URL is not set correctly or password is undefined.

**Solution:**

1. Check `server/.env` exists:
   ```bash
   cat server/.env
   ```

2. Ensure DATABASE_URL is set:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trello_db
   ```

3. Test connection manually:
   ```bash
   psql "postgresql://postgres:postgres@localhost:5432/trello_db"
   ```

#### Connection Refused

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart if needed
docker-compose restart postgres
```

#### Port 5432 Already in Use

```bash
# Windows: Check what's using port 5432
netstat -ano | findstr :5432

# macOS/Linux:
lsof -i :5432

# Change port in docker-compose.yml if needed
ports:
  - "5433:5432"
```

Then update `server/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/trello_db
```

#### Container Not Starting

```bash
# Check logs
docker-compose logs postgres

# Reset (remove volumes and start fresh)
docker-compose down -v
docker-compose up -d postgres
```

## Network Configuration

### Server Local + Docker PostgreSQL

If server runs locally and PostgreSQL in Docker:

```env
# server/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trello_db
```

### Both in Docker (docker-compose)

If using docker-compose for both services:

```yaml
# docker-compose.dev.yml
services:
  server:
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/trello_db
                                              ^^^^^^^^^
                                              Use service name, not localhost
```

## Database Reset

To completely reset the database:

```bash
# Stop and remove volumes
docker-compose down -v

# Start PostgreSQL fresh
docker-compose up -d postgres

# Run migrations again
cd server
npm run build
psql "postgresql://postgres:postgres@localhost:5432/trello_db" -f dist/migrations/001_init.sql
psql "postgresql://postgres:postgres@localhost:5432/trello_db" -f dist/migrations/002_full_schema.sql
psql "postgresql://postgres:postgres@localhost:5432/trello_db" -f dist/migrations/003_add_refresh_tokens.sql
```

## Production Setup

### Change Default Passwords

In production, don't use default credentials:

```yaml
# docker-compose.prod.yml
services:
  postgres:
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
```

```env
# .env.production
DB_USER=trello_user
DB_PASSWORD=<strong-password>
DB_NAME=trello_db
```

### Enable SSL

```yaml
# docker-compose.prod.yml
services:
  postgres:
    command: postgres -c ssl=on
```

```env
# server/.env.production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

## Quick Checklist

- [ ] PostgreSQL container is running (`docker ps`)
- [ ] `server/.env` exists with correct `DATABASE_URL`
- [ ] Migrations have been run
- [ ] Can connect to PostgreSQL manually with psql
- [ ] Server starts without errors
- [ ] Can login/register successfully
