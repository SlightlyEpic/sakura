# Nuxt Starter Template

A Nuxt starter template with authentication, RBAC, and PostgreSQL setup.

## Features

- **Authentication**: Supports email/password authentication and OAuth (Google, GitHub) via [nuxt-auth-utils](https://nuxt.com/modules/auth-utils)
- **RBAC**: Role-based access control using [nuxt-authorization](https://nuxt.com/modules/authorization) with "abilities"
- **Database**: Configured with [Drizzle ORM](https://orm.drizzle.team/) and PostgreSQL
- **Pre-built Components**: Login and Signup components and pages

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL instance

### Installation

```sh
git clone https://github.com/SlightlyEpic/nuxt-starter.git
cd nuxt-starter
pnpm install # or npm install / yarn install
```

### Environment Variables

Copy the example env into `.env` and fill in the values appropriately
```sh
cp .env.example .env
```

### Database Migrations

```sh
pnpm exec drizzle-kit push # Push migrations to database
```

### Running the Project

```sh
pnpm dev # or npm run dev / yarn dev
```
