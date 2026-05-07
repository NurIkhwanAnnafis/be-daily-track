# saas-backend

A backend service built with **Fastify**, **Drizzle ORM**, and **PostgreSQL** — designed for a SaaS application with authentication, transaction management, and reporting features.

## Tech Stack

- **Runtime**: Node.js >= 20
- **Framework**: Fastify
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (with PgBouncer support)
- **Auth**: JSON Web Tokens (JWT)
- **Validation**: Zod
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database (e.g. via Supabase, local instance, or Docker)

### Installation

```bash
npm install
```

### Environment Variables

Copy the example file and fill in the required values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NODE_ENV` | Application environment (`development`, `production`, etc.) |
| `DATABASE_URL` | PostgreSQL connection string (supports PgBouncer) |
| `JWT_ACCESS_SECRET` | Secret key for signing JWT access tokens (min. 32 characters) |
| `JWT_REFRESH_SECRET` | Secret key for signing JWT refresh tokens (min. 32 characters) |

### Running the App

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm run start
```

## Database

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Recalculate balances
npm run db:recalculate

# Open Drizzle Studio
npm run db:studio
```

## Docker

```bash
docker-compose up
```

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```
