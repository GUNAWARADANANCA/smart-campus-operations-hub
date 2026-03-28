# Smart Campus Operations Hub (Monorepo)

Production-oriented monorepo for campus operations: **Next.js** frontend and **Spring Boot 3** backend, orchestrated with **Turborepo**.

## Layout

```
apps/
  frontend/    Next.js (App Router), Tailwind CSS — http://localhost:3000
  backend/     Spring Boot 3, Java 17, MySQL — http://localhost:8080
packages/      Reserved for shared libraries (e.g. types)
turbo.json
package.json
```

Frontend calls the REST API at `http://localhost:8080/api` (override with `NEXT_PUBLIC_API_URL` in `apps/frontend/.env.local`).

## Prerequisites

- Node.js 20+ and [pnpm](https://pnpm.io/)
- Java 17+ and Maven 3.9+
- MySQL 8+ (create database `smart_campus` or let Hibernate create it per `application.yml`)

## Database

1. Create a MySQL user and database, or use the defaults in `apps/backend/src/main/resources/application.yml`.
2. Adjust `spring.datasource.*` for your environment.

Sample data loads on startup when the database is empty.

## Run everything (Turborepo)

From the repository root:

```bash
pnpm install
npx turbo run dev
```

This starts the frontend dev server and Spring Boot concurrently.

## Run apps individually

**Frontend**

```bash
cd apps/frontend
cp .env.local.example .env.local
pnpm dev
```

**Backend**

From the **repository root** (works on Windows PowerShell too):

```bash
pnpm dev:backend
```

Or from `apps/backend`:

```bash
cd apps/backend
node run-mvnw.cjs spring-boot:run
```

On **Windows PowerShell**, use `.\mvnw.cmd spring-boot:run` inside `apps/backend` — not `./mvnw` from the repo root (the wrapper only lives under `apps/backend`, and `./mvnw` is a Unix/Git Bash habit).

No global Maven install required: the repo ships the Maven Wrapper (`mvnw` / `mvnw.cmd`) in `apps/backend`.

You must have **Java 17+** installed. The wrapper expects **`JAVA_HOME`** to point at your JDK (e.g. `C:\Program Files\Java\jdk-17`). If you see *JAVA_HOME not found*, set it in System Environment Variables or in your shell, then open a new terminal.

To confirm: from `apps/backend`, run `node run-mvnw.cjs -v` (should print Apache Maven version).

## Other scripts

| Scope   | Build        | Lint        |
|---------|--------------|------------|
| Root    | `pnpm build` | `pnpm lint` |
| Frontend| `pnpm --filter frontend build` | `pnpm --filter frontend lint` |
| Backend | `node apps/backend/run-mvnw.cjs -B package -DskipTests` | `node apps/backend/run-mvnw.cjs -B -q compile` |

## Authentication (development)

The API uses Spring Security. For local development, authenticate requests by sending the logged-in user’s email:

`X-Dev-User-Email: <user-email>`

After `POST /api/auth/login`, the frontend stores the user and sends this header on each request. This keeps the stack working before OAuth2 (e.g. Google) is wired in.

## API overview

| Resource      | Base path              |
|---------------|------------------------|
| Auth          | `/api/auth/login`, `/api/auth/register` |
| Users         | `/api/users`           |
| Resources     | `/api/resources`       |
| Bookings      | `/api/bookings`        |
| Tickets       | `/api/tickets`         |
| Notifications | `/api/notifications`   |

Use standard REST verbs: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` where exposed by controllers.

## License

Private / academic use per your institution’s policy.
