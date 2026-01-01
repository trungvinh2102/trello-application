# Docker Quick Start Guide

## Prerequisites
- Docker
- Docker Compose

## Quick Start (Recommended)

### Production Build
```bash
# Clone the repository
git clone <repository-url>
cd trello-app

# Start all services
docker-compose up -d

# Access the application
# Client: http://localhost:3000
# API: http://localhost:5000
```

### Development Mode with Hot Reload
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Access the application
# Client: http://localhost:5173
# API: http://localhost:5000
```

## Common Commands

```bash
# View all containers
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Stop and remove volumes (delete data)
docker-compose down -v

# Rebuild services
docker-compose build --no-cache
docker-compose up -d

# Restart specific service
docker-compose restart server
```

## Accessing Services

### PostgreSQL Database
```bash
# Connect to database
docker exec -it trello_postgres psql -U trello_user -d trello_system

# From host machine
psql -h localhost -p 5432 -U trello_user -d trello_system
```

### Server Container
```bash
# Access server shell
docker exec -it trello_server sh

# View server logs
docker-compose logs -f server
```

### Client Container
```bash
# Access client shell
docker exec -it trello_client sh

# View client logs
docker-compose logs -f client
```

## Troubleshooting

### Port Already in Use
```bash
# Edit docker-compose.yml
services:
  postgres:
    ports:
      - "5433:5432"  # Change to 5433
  server:
    ports:
      - "5001:5000"   # Change to 5001
  client:
    ports:
      - "3001:80"     # Change to 3001
```

### Container Won't Start
```bash
# Check logs
docker-compose logs [service_name]

# Recreate containers
docker-compose down
docker-compose up -d --force-recreate
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Manually run migrations
docker exec -it trello_postgres psql -U trello_user -d trello_system -f /docker-entrypoint-initdb.d/init.sql
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Allocate more resources (Docker Desktop settings)
# - CPUs: 4+
# - Memory: 8GB+
```

## Development Workflow

### Making Changes
```bash
# 1. Make code changes in local files
# 2. Changes auto-sync to containers via volumes
# 3. Hot reload automatically refreshes

# Check logs
docker-compose -f docker-compose.dev.yml logs -f server
docker-compose -f docker-compose.dev.yml logs -f client
```

### Reset Everything
```bash
# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v

# Remove Docker images
docker rmi $(docker images -q trello_*)

# Rebuild from scratch
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

## Production Deployment

### Build Production Images
```bash
# Build production images
docker-compose build

# Test locally
docker-compose up -d

# Push to registry (if needed)
docker tag trello_server your-registry/trello-server:latest
docker push your-registry/trello-server:latest
```

### Environment Variables
Create `.env` file:
```env
# Server
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://trello_user:trello_password@postgres:5432/trello_system
JWT_SECRET=your-production-secret

# Client
VITE_API_URL=https://your-domain.com/api
```

### SSL/HTTPS
For production, use reverse proxy (Nginx) with SSL certificates:
```yaml
# docker-compose.prod.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
```

## Monitoring

### Health Checks
```bash
# Check container status
docker-compose ps

# Check PostgreSQL health
docker exec -it trello_postgres pg_isready -U trello_user

# Check API health
curl http://localhost:5000/api/health
```

### Logs
```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific time range
docker-compose logs --since 2024-01-01T00:00:00 --until 2024-01-01T23:59:59
```

## Backup & Restore

### Backup Database
```bash
# Backup to file
docker exec trello_postgres pg_dump -U trello_user trello_system > backup.sql

# Backup to host directory
docker exec trello_postgres pg_dump -U trello_user trello_system > ./backups/backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
# Restore from file
docker exec -i trello_postgres psql -U trello_user trello_system < backup.sql
```

## Network Issues

### Check Network
```bash
# List networks
docker network ls

# Inspect network
docker network inspect trello_network

# Test connectivity
docker exec trello_client ping server
docker exec trello_server ping postgres
```

## Cleanup

### Remove Unused Resources
```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove all unused containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Remove all unused networks
docker network prune
```

## Getting Help

- View logs: `docker-compose logs -f`
- Check status: `docker-compose ps`
- Restart: `docker-compose restart [service]`
- Rebuild: `docker-compose build --no-cache`
