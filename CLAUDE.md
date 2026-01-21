# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

lexSport is a full-stack business management application for tracking workers, products, activities (production), and schedules in a clothing/textile manufacturing context. The UI is in Spanish.

## Commands

### Root Level (Server + Client Build)
```bash
npm run dev           # Development: build server + copy client + run
npm run prod          # Production: build server + copy client + run
npm run watch:dev     # Development with nodemon (hot reload)
npm run build         # Transpile server with Babel
```

### Client (React)
```bash
cd client
npm start             # Start React dev server (port 3000)
npm test              # Run Jest tests in watch mode
npm run build         # Production build
```

Server runs on port 9000 (configurable via PORT env var). Client proxies to localhost:3001 in development.

## Architecture

### Backend (Express + MySQL)

**Layered architecture:**
- `server/routes/` - Express route handlers with validation (express-validator)
- `server/services/` - Business logic, data transformation
- `server/repositories/` - Direct MySQL queries using mysql2/promise
- `server/database/conectDB.js` - Database connection factory

**Authentication:** JWT tokens with middleware in `server/utils/passUtils.js`. Two auth middlewares:
- `verifyAuthJWToken` - Validates any authenticated user
- `verifyAuthJWTokenIsAdmin` - Validates admin role only

**Key entities:**
- Workers (costureraas, operators, jornaleros) - with roles and permissions
- Products - with making/fill prices
- Activities - production records linking workers to products
- Schedules - time tracking (enter/break/endbreak/exit)

### Frontend (React + Redux Toolkit + MUI)

**State management:**
- `client/src/store.js` - Redux store configuration
- `client/src/slices/` - Redux Toolkit slices (auth, workers, products, generalSettings)

**API layer:**
- `client/src/utils/apiUtils.js` - Centralized API calls with axios, JWT auth headers

**Routing:** React Router v6 with role-based route access (admin vs operator permissions)

**Components:** `client/src/components/` - Page-level components with lazy loading

## Database

MySQL database named `lexsport`. Schema in `server/database/database.sql`.

**Environment variables:**
- `LEX_SPORT_DB_CONNECT_URL` (default: localhost)
- `LEX_SPORT_DB_USERNAME` (default: root)
- `LEX_SPORT_DB_PASSWORD` (default: root)
- `LEX_SPORT_DB_PORT` (default: 3306)

## Conventions

- Database columns use snake_case, JavaScript uses camelCase (auto-converted via `camelize` utility)
- Soft deletes use `hidden` column (0/1) rather than actual deletion
- Roles: `admin`, `costurera`, `operator`, `jornalero`
- Operator permissions: `makes`, `fill`, `schedule`
- Peru timezone (UTC-5) used for date calculations
