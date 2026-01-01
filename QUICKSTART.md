# Quick Start Guide

## Running the Application

### 1. Start the Server
```bash
cd server
yarn dev
```
Server runs on: http://localhost:5000

### 2. Start the Client
```bash
cd client
yarn dev
```
Client runs on: http://localhost:5173

### 3. Access the Application
- Main App: http://localhost:5173
- Dashboard: http://localhost:5173/dashboard

## Troubleshooting

### Database Connection Issues
Make sure PostgreSQL is running and update `server/.env` with correct credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/trello_db
```

### Port Already in Use
If port 5000 or 5173 is in use, you can change them:
- Server: Edit `PORT` in `server/.env`
- Client: Vite will automatically find an available port

## TypeScript Configuration
Both client and server use TypeScript:
- Client: `client/tsconfig.json`
- Server: `server/tsconfig.json`

## Shadcn Components
Shadcn is configured in `client/components.json`. Add new components with:
```bash
cd client
npx shadcn@latest add [component-name]
```
