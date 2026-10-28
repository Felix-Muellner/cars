# Development guide

Details for working on the Cars API. The [README](../README.md) has the
short version.

## The development environment

The GitHub Codespace (defined in [`.devcontainer/`](../.devcontainer))
runs two containers with Docker Compose:

| Container | What it runs |
| :--- | :--- |
| `app` | The workspace: Node.js 24, npm, GitHub CLI, Claude Code. You and the API run here. |
| `postgres` | PostgreSQL 18 (`postgres:18` image) with two databases: `cars` and `cars_test`. |

When the Codespace starts, it runs `npm run migrate && npm run db:seed`, so
the `cars` database is up to date and has the two example cars. Then
`npm start` is all you need.

The database files live in a Docker volume, so your cars survive restarts of
the Codespace. Rebuilding the Codespace without that volume starts from an
empty database (which the start-up commands migrate and seed again).

## Environment variables

| Variable | Used by | Codespace value |
| :--- | :--- | :--- |
| `DATABASE_URL` | `npm start`, `npm run migrate`, `npm run db:seed` | `postgres://cars:cars@postgres:5432/cars` |
| `TEST_DATABASE_URL` | `npm test` | `postgres://cars:cars@postgres:5432/cars_test` |

The Codespace and CI set them for you. Elsewhere, copy
[`.env.example`](../.env.example) to `.env` (git-ignored) and adjust it;
the npm scripts load `.env` if it exists, and variables that are already set
win over it. The password `cars` is not a secret: these databases are local
and thrown away. Real secrets come with the cloud deployment (Phase 6).

## The database

### Schema and migrations

The schema (tables, columns, constraints) is built by **migrations**: SQL
files in [`migrations/`](../migrations), each one a single change. `npm run
migrate` applies the ones a database has not had yet and records them in the
`pgmigrations` table, so every database ends up with the same schema.

To change the schema, add a new migration:

```bash
npx node-pg-migrate create add-car-color -j sql
```

Write the change under `-- Up Migration` (and how to undo it under
`-- Down Migration`), then run `npm run migrate`.

**Never edit, rename or delete a migration that is already on `main`.**
Databases that ran the old version would never pick up the edit. CI checks
this (`npm run check:migrations`).

The app never changes the schema itself. If the table is missing, `npm
start` stops with "The cars table does not exist. Run npm run migrate."

### Example cars

`npm run db:seed` adds Toyota Corolla and Honda Civic, but only if the
`cars` table is empty, so it never touches your own cars. Ids are never
reused: if you delete car 1, the Swagger UI example "An existing car (1)"
returns 404 until the database is recreated.

## Tests

`npm test` runs three kinds of tests:

| File | What it tests | Needs Postgres |
| :--- | :--- | :--- |
| `test/cars.test.js`, `test/openapi.test.js` | HTTP routes, validation, errors, API docs, with the in-memory store | no |
| `test/carsStore.test.js` | the store contract (`test/storeContract.js`) against the in-memory store | no |
| `test/pgCarsStore.test.js` | the store contract against Postgres, the table constraints, startup checks, seeding, and the app end to end | yes |

The Postgres tests use `TEST_DATABASE_URL` (`cars_test`), migrate it, and
empty the `cars` table before each test, so they never touch your
development data. They all live in one file because `node --test` runs files
in parallel and they share one table.

If Postgres is not running, only the Postgres tests fail, with one message:
"Cannot reach Postgres at … Is the database running?".

## Running outside the Codespace

You need Node.js 24 and a PostgreSQL 18 server. With Docker, for example:

```bash
docker run -d --name cars-postgres -p 5432:5432 \
  -e POSTGRES_USER=cars -e POSTGRES_PASSWORD=cars -e POSTGRES_DB=cars \
  postgres:18
docker exec cars-postgres createdb -U cars cars_test

cp .env.example .env   # points at localhost:5432
npm install
npm run migrate
npm run db:seed
npm start
```

## Troubleshooting

| Message | What to do |
| :--- | :--- |
| `DATABASE_URL is not set` | Outside the Codespace: create `.env` from `.env.example`. |
| `Cannot connect to the database at …` / `Cannot reach Postgres at …` | Postgres is not running or not reachable. In the Codespace, rebuild the container; in CI, check the `postgres` service. |
| `The cars table does not exist. Run npm run migrate.` | Run `npm run migrate`. |
| `Not run migration … is preceding already run migration …` | A new migration has an older timestamp than one that already ran. Create it again with `npx node-pg-migrate create`. |
