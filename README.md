# Cars REST API

A lightweight RESTful API for managing car inventory data, built with Node.js and Express.

This project serves as a foundational backend project to practice core web API design, standard API documentation, iterative database integration, containerization, and modern deployment workflows.

---

## 🎯 Project Objectives & Roadmap

- [x] **Phase 1: Core REST API**  
  Implement full CRUD endpoints with Express, standard HTTP status codes, and an in-memory data store.
- [x] **Phase 2: API Documentation**  
  Define and document all endpoints using the OpenAPI Specification (OAS).
- [ ] **Phase 3: Database Persistence**  
  Integrate a production database (PostgreSQL / MongoDB) with schema validation.
- [ ] **Phase 4: Containerization**  
  Containerize the application and database using Docker and Docker Compose.
- [x] **Phase 5: CI/CD Pipeline**  
  Automate linting and testing using GitHub Actions.
- [ ] **Phase 6: Cloud Deployment**  
  Deploy the containerized service to a cloud provider.

---

## 🛠️ Tech Stack & Tooling

* **Runtime:** Node.js
* **Package Manager:** npm
* **Framework:** Express.js
* **API Documentation:** OpenAPI 3.0 via swagger-jsdoc, Swagger UI at `/api-docs`
* **Testing:** node:test + supertest
* **Linting:** ESLint
* **CI:** GitHub Actions (`npm run check` on every push and PR)
* **Data Store (Phase 1):** In-memory (JavaScript array / JSON)
* **Code Editor:** Visual Studio Code
* **API Testing:** Bruno, REST Client (VS Code Extensions)
* **Version Control:** Git, GitHub

---

## 🤖 Agentic Workflow

The development workflow changed between phases:

- **Phase 1 – manual local development:** The code was written and run locally by hand. The Gemini LLM chat interface on the web served as the assistant for questions, explanations and code suggestions, which were copied into the project manually.
- **Phase 2 onwards – ephemeral GitHub Codespace:** Development moves into a short-lived GitHub Codespace defined by the repository's devcontainer configuration. [Claude Code CLI](https://claude.com/claude-code) runs directly in the Codespace, where it can read the codebase, edit files and run commands. The [GitHub CLI (`gh`)](https://cli.github.com/) handles planning and project management from the terminal, such as creating issues under milestones, labeling them and working through them.

Because the environment is ephemeral and fully described by the devcontainer, every session starts from the same reproducible state, and the repository (code, issues and milestones) remains the single source of truth.

---

## 🚀 API Endpoints (Cars)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cars` | Retrieve all cars | `200 OK` |
| `GET` | `/api/cars/:id` | Retrieve a specific car by ID | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `POST` | `/api/cars` | Add a new car | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/cars/:id` | Update an existing car | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/cars/:id` | Remove a car by ID | `204 No Content` / `400 Bad Request` / `404 Not Found` |

Every error response has a JSON body `{ "message": string }`. Validation failures also include `errors: string[]`. A body that is not valid JSON returns `400` with `"Invalid JSON"`, an unknown route returns `404` with `"Not found"`, and an unexpected server error returns `500` with `"Internal server error"`, without a stack trace.

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 24 or later
- [npm](https://www.npmjs.com/)

### Setup & Run
```bash
npm install
npm start
```
The API will run at `http://127.0.0.1:3000`. Interactive API docs (Swagger UI) are at `http://127.0.0.1:3000/api-docs`, and the raw OpenAPI spec is at `/api-docs.json`.

### Test & Lint
```bash
npm test        # run the tests
npm run check   # lint + tests (what CI runs)
```
