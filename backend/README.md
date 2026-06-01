# Store Rating Backend

Backend API for a store rating app built with NestJS, TypeORM, PostgreSQL, and JWT auth.

## What it does

- lets users register and log in
- lets admins create users and stores
- lets users rate stores
- shows store-owner dashboard data

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- JWT
- bcryptjs

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL running locally or on a server

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=store_rating_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
DB_DROP_SCHEMA=false
```

## Run the app

Start the server in development mode:

```bash
npm run start:dev
```

API base URL:

```text
http://localhost:3001/api
```

Build for production:

```bash
npm run build
```

## Default admin

On startup in development, the app creates a default admin account if one does not already exist.

- email: `admin@storerating.com`
- password: `Admin@1234`

## Roles

- `ADMIN` - create users, create stores, view all users and stores
- `USER` - log in, view stores, rate stores, update password
- `STORE_OWNER` - view the store-owner dashboard

## API Overview

### Auth

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Users

```http
POST /api/users/register
GET /api/users
GET /api/users/:id
PUT /api/users/update-password
```

### Stores

```http
POST /api/stores
GET /api/stores
GET /api/stores/:id
```

### Ratings

```http
POST /api/ratings
PUT /api/ratings/:id
```

### Admin

```http
GET /api/admin/dashboard
POST /api/admin/users
POST /api/admin/stores
GET /api/admin/users
GET /api/admin/stores
GET /api/admin/users/:id
```

### Store Owner

```http
GET /api/store-owner/dashboard
```

## Creating a store owner

Use the admin create-user endpoint and send `role: "store_owner"`:

```json
{
  "name": "Store Owner",
  "email": "owner@example.com",
  "password": "Owner@1234",
  "address": "Some address",
  "role": "store_owner"
}
```

Then log in with that email and password.

## Validation Rules

- name: 3 to 50 characters
- email: valid email format
- password: 8 to 16 characters, one uppercase letter, one special character
- store rating value: 1 to 5
- optional `ownerId` must be a UUID

## Scripts

- `npm run start` - start once
- `npm run start:dev` - start with watch mode
- `npm run build` - compile the backend
- `npm run seed` - seed the default admin manually
- `npm run lint` - run ESLint with auto-fix
- `npm run test` - run unit tests
- `npm run test:e2e` - run e2e tests

## Notes

- The API uses the `/api` prefix.
- CORS uses `FRONTEND_URL`.
- `DB_DROP_SCHEMA=false` keeps data between restarts.
- Set `DB_DROP_SCHEMA=true` only if you want to wipe the database on startup during local testing.
- TypeORM `synchronize` is enabled for development only.
