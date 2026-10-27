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
  Routes talk to it only through list, get, create, update, remove.

## Rules

- `make` and `model` must be non-empty after trimming spaces.
- `year` must be a whole number from 1886 to next year.
- A car id in the URL must be a positive integer, otherwise 400
  "Invalid car id".
- PUT replaces all of make, model and year (no partial updates).
  Order of checks: bad id 400, unknown id 404, bad body 400.
- A body that is not valid JSON gives 400 "Invalid JSON". An unknown
  route gives 404 "Not found".
- Data is in memory and resets on restart (until Phase 3).

## Not decided yet

- Database choice and id strategy for Phase 3.