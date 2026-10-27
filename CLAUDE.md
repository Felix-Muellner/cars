# Cars API

Node.js + Express 5 REST API for car inventory (CommonJS).
Domain terms and rules: read CONTEXT.md before changing behavior.

## Commands

- `npm start`: run the API on http://127.0.0.1:3000
- `npm test`: run the tests (node:test + supertest, in test/)
- `npm run check`: lint + tests. Must pass before any PR.

## Code layout

- `src/app.js`: createApp() and the routes
- `src/carsStore.js`: all data access, via list/get/create/update/remove
- `src/validation.js`: input and id validation
- `src/server.js`: starts the server only

## Workflow Guidelines

- Never commit directly to `main`.
- Always create and switch to a feature branch (`feat/...`, `docs/...`,
  or `fix/...`) before modifying code.
- Open a pull request using `gh pr create` upon completion for human review.

## Definition of done

- New or changed behavior has a test in test/ that failed before the change.
- `npm run check` passes.
- If the API changed: README, requests.http and CONTEXT.md are updated.
- The PR description says which issue it closes ("Closes #N").