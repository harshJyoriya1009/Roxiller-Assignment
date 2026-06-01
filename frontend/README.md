# RateStore Frontend

RateStore is a React frontend for a store rating app. It has three main user roles:

- `admin` manages users, stores, and platform stats
- `store_owner` checks store ratings and customer feedback
- `user` browses stores and submits ratings

## Tech Stack

- React 19
- TypeScript
- Axios
- Create React App
- Plain CSS for styling

## Features

- login and registration
- role-based layouts
- browse stores
- search and filter lists
- create and update ratings
- admin panels for users and stores
- store-owner dashboard with rating history
- password update flow

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set the API URL

Create a `.env` file in the frontend folder if you do not already have one:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

If this is not set, the app falls back to `http://localhost:3001/api`.

### 3. Start the app

```bash
npm start
```

The app runs at `http://localhost:3000`.

## Available Scripts

- `npm start` starts the development server
- `npm test` runs the test suite
- `npm run build` creates a production build

## Project Structure

```text
src/
  api/          Axios client and API modules
  components/   auth, admin, user, and shared UI
  context/      auth state
  types/        shared TypeScript types
  utils/        validation and error helpers
```

## How It Works

- The app stores the auth token and user data in `localStorage`
- On load, it tries to restore the session and verify it with `/auth/me`
- The top-level `App` chooses the correct layout based on the logged-in user role
- Shared UI pieces like `Modal`, `Sidebar`, `StarRating`, and `SortableHeader` are reused across screens

## Build and Deploy

Create a production build with:

```bash
npm run build
```

This repo also includes:

- `Dockerfile` for container builds
- `nginx.conf` for serving the built app with SPA routing

## Notes

This frontend is intentionally kept simple. The code is split by role and feature, but the components stay small and practical so it is easy to follow and extend.
