# Cars API: domain context

Shared vocabulary and rules. Use these exact names in code, tests,
OpenAPI schemas and examples, and the README.

## Terms

- **Car**: a stored car. Fields: `id` (positive integer, assigned by
  the server), `make` (string), `model` (string), `year` (integer).
- **CarInput**: what a client sends to create or replace a car:
  `make`, `model`, `year`. Never includes `id`.
- **Error**: every 4xx response body is `{ "message": string }`,
  plus `errors: string[]` for validation failures. Every 5xx body is
  `{ "message": "Internal server error" }`, never a stack trace.
- **Store**: the module that keeps cars (`src/carsStore.js`).
  Routes talk to it only through list, get, create, update, remove,
  which all return Promises.

## Rules

- `make` and `model` must be non-empty after trimming spaces and at
  most 100 characters after trimming. Length counts characters, not
  UTF-16 units (an emoji is one character). Too long gives 400
  "Invalid car" with e.g. "make must be at most 100 characters".
- `year` must be a whole number from 1886 to next year.
- A car id in the URL must be a positive integer, otherwise 400
  "Invalid car id".
- PUT replaces all of make, model and year (no partial updates).
  Order of checks: bad id 400, unknown id 404, bad body 400.
- A body that is not valid JSON gives 400 "Invalid JSON". An unknown
  route gives 404 "Not found".
- Data is in memory and resets on restart (until Phase 3).
- Ids are never reused and may have gaps. Never assume ids are
  consecutive.
- The server listens on 127.0.0.1:3000 (hard-coded until Phase 4).

## Phase 3: decided, not built yet

Each Phase 3 issue moves its rules from here into Terms and Rules
above when it lands.

- **Database**: PostgreSQL 18 (`postgres:18` image). The devcontainer
  runs it as a Docker Compose service next to the workspace; CI runs
  it as a GitHub Actions service container. Two databases: `cars`
  (development) and `cars_test` (tests only).
- **Schema**: table `cars` with `id integer GENERATED ALWAYS AS
  IDENTITY PRIMARY KEY`, `make varchar(100)` and `model varchar(100)`
  (NOT NULL, not blank after trimming), `year integer` (NOT NULL,
  >= 1886). "Year at most next year" is checked in validation.js only.
- **Migrations**: node-pg-migrate, written in SQL, in `migrations/`.
  Run with `npm run migrate`; the app never migrates itself. Never
  edit, rename or delete a migration that is on `main`; add a new one.
  CI enforces this.
- **Queries**: `pg` with parameters (`$1`, `$2`, ...) only. Never build
  SQL by string concatenation or template strings.
- **Store**: two implementations: in-memory
  (`createCarsStore`, default for `createApp()`) and Postgres
  (`createPgCarsStore`, used by server.js). `list` is ordered by id.
- **Tests**: shared store contract tests run against both stores.
  Postgres tests live in one file, use `cars_test`, and run
  `TRUNCATE cars RESTART IDENTITY` before each test.
- **Config**: `DATABASE_URL` and `TEST_DATABASE_URL` (see
  `.env.example`). The app refuses to start if `DATABASE_URL` is not
  set.
- **Database down**: at startup the app exits with a clear message.
  During a request it gives 500 "Internal server error" after at most
  a 5 second connection timeout.
- **Seed data**: `npm run db:seed` adds the two example cars to the
  dev database only when the table is empty. Never in a migration.

## Later phases

- Phase 4: HOST/PORT from the environment, a health check endpoint,
  503 for database outages and a review of 5xx status codes.
- Phase 6: cloud database with real secrets and TLS to the database;
  HTTPS terminated by the platform.