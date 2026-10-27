# Cars API

Node.js + Express 5 REST API for car inventory (CommonJS).
Requires Node 24+ (CI and the devcontainer use Node 24, the current LTS).
Domain terms and rules: read CONTEXT.md before changing behavior.

## Commands

- `npm start`: run the API on http://127.0.0.1:3000
- `npm test`: run the tests (`node --test`, with node:test + supertest).
  Put tests in test/*.test.js.
- `npm run check`: lint + tests

## Code layout

- `src/app.js`: createApp(), the routes and their `@openapi` JSDoc
  annotations
- `src/openapi.js`: builds the OpenAPI spec from app.js; served at
  /api-docs (Swagger UI) and /api-docs.json
- `src/carsStore.js`: all data access, via list/get/create/update/remove
- `src/validation.js`: input and id validation
- `src/server.js`: starts the server only

## Workflow Guidelines

- Never commit directly to `main`.
- Always create and switch to a feature branch before modifying any
  file (code or docs). The branch prefix is the commit type: `feat/`,
  `fix/`, `docs/`, `test/`, `refactor/`, `ci/` or `chore/`.
- Commit messages: `type: summary (closes #N)` for the commit that
  completes an issue, `type: summary (#N)` for other commits on it.
- Every PR closes an issue. If none exists, create one with
  `gh issue create` first.
- Open a pull request using `gh pr create` upon completion for human review.

## Definition of done

- New or changed behavior has a test in test/ that failed before the
  change (not needed for docs-, ci- or chore-only changes).
- `npm run check` passes.
- If the API changed: the `@openapi` annotations in src/app.js, README,
  requests.http and CONTEXT.md are updated.
- The PR description says which issue it closes ("Closes #N").
