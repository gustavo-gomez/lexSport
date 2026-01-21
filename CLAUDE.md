# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

lexSport is a full-stack business management application for tracking workers, products, activities (production), and schedules in a clothing/textile manufacturing context. The UI is in Spanish.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma 7, MySQL, Tailwind CSS 4, Auth.js v5

## Commands

```bash
npm run dev           # Start development server with Turbopack
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
```

## Architecture

### App Router Structure

- `src/app/(auth)/` - Authentication pages (login)
- `src/app/(dashboard)/` - Protected dashboard pages
- `src/app/api/` - API routes (auth handlers)
- `src/actions/` - Server Actions for CRUD operations
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities (auth, db, utils)
- `src/generated/prisma/` - Generated Prisma client

### Authentication

- Auth.js v5 with Credentials provider
- Server Layout Guards pattern (not middleware) for route protection
- JWT session strategy with 30-day expiration
- Roles: `admin`, `costurera`, `operator`, `jornalero`

### Database (Prisma 7)

- MySQL with `@prisma/adapter-mariadb` driver adapter
- Schema in `prisma/schema.prisma`
- Config in `prisma.config.ts`

**Key entities:**
- Workers - with roles and permissions
- Products - with making/fill prices
- Activities - production records linking workers to products
- Schedules - time tracking (enter/break/endbreak/exit)

### Environment Variables

```env
DATABASE_URL=mysql://user:password@host:port/database
AUTH_SECRET=your-secret-key
PRIVATE_KEY=keylexsportsystem
```

## Conventions

- Database columns use snake_case, TypeScript uses camelCase (Prisma auto-converts)
- Soft deletes use `hidden` column (0/1)
- Peru timezone (UTC-5) for date calculations
- Server Actions include authorization checks
- UI components in `src/components/ui/`
