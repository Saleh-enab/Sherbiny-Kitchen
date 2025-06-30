# Sherbiny Kitchen

Sherbiny Kitchen is a modern web application that leverages AI to generate personalized recipes based on your available ingredients. It features a robust backend API and a user-friendly React frontend, allowing users to register, log in, generate recipes, and manage their personal recipe collections.

## Features

- AI-powered recipe generation using Google Gemini
- User authentication and JWT-based authorization
- Recipe management: generate, save, and retrieve recipes
- Ingredient management
- Email verification and password reset
- Responsive, modern UI built with React and Tailwind CSS

## Tech Stack

- **Monorepo:** Managed with npm workspaces
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, Google Gemini API, Redis, JWT, Nodemailer, Swagger
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios

## Getting Started

### Prerequisites

- Node.js 16+
- npm or pnpm
- PostgreSQL database

### Installation

1. Clone the repository and install dependencies from the root:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Set up environment variables for both API and client (see below).

3. Start the backend API:
   ```bash
   cd packages/api
   npm run dev
   ```

4. Start the frontend client:
   ```bash
   cd packages/client
   npm run dev
   ```

## Project Structure

```
Sherbiny Kitchen/
├── packages/
│   ├── api/      # Backend API (Express, Prisma, etc.)
│   └── client/   # Frontend (React, Vite, Tailwind CSS)
├── package.json  # Monorepo root
└── pnpm-lock.yaml
```

## API Overview

- Full API documentation available at `/api-docs` when the backend is running.
- Main endpoints:
  - `POST /api/v1/auth/register` – Register a new user
  - `POST /api/v1/auth/login` – User login
  - `GET /api/v1/ingredient` – List available ingredients
  - `POST /api/v1/recipe/generate` – Generate a recipe
  - `POST /api/v1/recipe/save/{recipeKey}` – Save a recipe
  - `GET /api/v1/recipe` – Get user's saved recipes

## Environment Variables

### Backend (`packages/api/.env`)

- `PORT` – API server port (default: 3000)
- `DATABASE_URL` – PostgreSQL connection string
- `EMAIL_APP_USER` – Email address for sending system emails
- `EMAIL_APP_PASSWORD` – Email password or app password
- `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL` – Token lifetimes (e.g., `15m`, `7d`)
- `ACCESS_TOKEN_PUBLIC_KEY`, `ACCESS_TOKEN_PRIVATE_KEY` – JWT keys
- `REFRESH_TOKEN_PUBLIC_KEY`, `REFRESH_TOKEN_PRIVATE_KEY` – JWT keys
- `GEMINI_API_KEY` – Google Gemini API key
- `REDIS_URL` – Redis connection string

### Frontend (`packages/client/.env`)

- `VITE_API_URL` – URL of the backend API (e.g., `http://localhost:3000`)

## Contributing

- Follow the existing code style (TypeScript, ESLint, Prettier)
- Add types for new features
- Test your changes
- Update documentation as needed

## License

This project is licensed under the ISC License. 