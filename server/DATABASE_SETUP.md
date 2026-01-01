# Database Setup Guide

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm/yarn installed

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE trello_db;

# Exit
\q
```

### 2. Create User (Optional - if you want separate user)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create user
CREATE USER trello_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE trello_db TO trello_user;

# Exit
\q
```

### 3. Run Migrations

```bash
cd server
npm run build

# Run migrations manually
psql -U postgres -d trello_db -f dist/migrations/001_init.sql
psql -U postgres -d trello_db -f dist/migrations/002_full_schema.sql
psql -U postgres -d trello_db -f dist/migrations/003_add_refresh_tokens.sql

# Or using migration tool (if configured)
npm run migrate
```

### 4. Configure Environment Variables

Create `.env` file in server directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trello_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:5173
```

**Important:** 
- Replace `postgres:postgres` with your actual username and password
- Make sure the password is a valid string (no special characters that need URL encoding)
- If password contains special characters like `@`, `:`, `/`, URL-encode them using `%XX` format

**Example with special characters:**
```
Password: P@ssw0rd!
Encoded: P%40ssw0rd%21
URL: postgresql://username:P%40ssw0rd%21@localhost:5432/trello_db
```

### 5. Verify Database Connection

```bash
cd server
npm run dev
```

Check console logs for successful database connection.

## Troubleshooting

### Error: "SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"

**Cause:** Database password in `DATABASE_URL` is undefined, null, or contains improperly encoded special characters.

**Solutions:**

1. **Check .env file:**
   ```bash
   cat server/.env
   ```
   Ensure `DATABASE_URL` is set correctly.

2. **Verify password is a string:**
   - Make sure there are no quotes missing
   - Check for empty passwords

3. **Encode special characters in password:**
   ```
   @ -> %40
   : -> %3A
   / -> %2F
   ? -> %3F
   # -> %23
   [ -> %5B
   ] -> %5D
   ! -> %21
   $ -> %24
   & -> %26
   ' -> %27
   ( -> %28
   ) -> %29
   * -> %2A
   + -> %2B
   , -> %2C
   = -> %3D
   ```

4. **Test connection manually:**
   ```bash
   psql "postgresql://username:password@localhost:5432/trello_db"
   ```

### Error: "relation does not exist"

**Cause:** Migrations haven't been run yet.

**Solution:** Run migrations as shown in step 3.

### Error: "Database "trello_db" does not exist"

**Cause:** Database hasn't been created.

**Solution:** Create database as shown in step 1.

### Error: "password authentication failed"

**Cause:** Incorrect password or username in `DATABASE_URL`.

**Solution:** 
1. Verify PostgreSQL credentials
2. Check if user exists:
   ```sql
   SELECT * FROM pg_user;
   ```
3. Reset password if needed:
   ```sql
   ALTER USER username WITH PASSWORD 'new_password';
   ```

## Production Setup

1. **Use strong password:**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

2. **Use environment-specific .env file:**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:strong_password@prod-db-server:5432/trello_db
   ```

3. **Enable SSL:**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
   ```

4. **Change JWT_SECRET:**
   ```env
   JWT_SECRET=<your-secure-random-string>
   ```

5. **Set CORS origin to production domain:**
   ```env
   CORS_ORIGIN=https://your-domain.com
   ```

## Additional Resources

- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [pg-pool Documentation](https://node-postgres.com/apis/pool)
- [Zod Validation](https://zod.dev/)
