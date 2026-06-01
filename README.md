# Store Rating App

Full-stack store rating system with role-based access for admins, store owners, and normal users.

## Overview

- Users can register, log in, browse stores, and submit or update ratings.
- Admins can create users, create stores, and view platform stats.
- Store owners can view their store dashboard and rating summary.

## Tech Stack

- Frontend: React, TypeScript, Axios, React Router
- Backend: NestJS, TypeORM, JWT, Passport, bcryptjs
- Database: PostgreSQL
- Deployment: Docker Compose, Nginx for frontend build

## Project Structure

- `frontend/` - React client
- `backend/` - NestJS API
- `docker-compose.yml` - local full-stack setup

## Setup

### Docker

```bash
docker-compose up --build
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Key Scripts

- Backend: `npm run start:dev`, `npm run build`, `npm run seed`, `npm run test`
- Frontend: `npm start`, `npm run build`, `npm test`

## Environment

- Backend: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `FRONTEND_URL`, `DB_DROP_SCHEMA`
- Frontend: `REACT_APP_API_URL`

## Default Admin

- Email: `admin@storerating.com`
- Password: `Admin@1234`

## URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`
# Roxiller-Assignment
