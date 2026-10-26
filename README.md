# Cars REST API

A lightweight RESTful API for managing car inventory data, built with Node.js and Express.

This project serves as a foundational backend project to practice core web API design, standard API documentation, iterative database integration, containerization, and modern deployment workflows.

---

## 🎯 Project Objectives & Roadmap

- [x] **Phase 1: Core REST API**  
  Implement full CRUD endpoints with Express, standard HTTP status codes, and an in-memory data store.
- [ ] **Phase 2: API Documentation**  
  Define and document all endpoints using the OpenAPI Specification (OAS).
- [ ] **Phase 3: Database Persistence**  
  Integrate a production database (PostgreSQL / MongoDB) with schema validation.
- [ ] **Phase 4: Containerization**  
  Containerize the application and database using Docker and Docker Compose.
- [ ] **Phase 5: CI/CD Pipeline**  
  Automate linting and testing using GitHub Actions.
- [ ] **Phase 6: Cloud Deployment**  
  Deploy the containerized service to a cloud provider.

---

## 🛠️ Tech Stack & Tooling

* **Runtime:** Node.js
* **Package Manager:** npm
* **Framework:** Express.js
* **API Documentation:** OpenAPI Specification (Planned)
* **Data Store (Phase 1):** In-memory (JavaScript array / JSON)
* **Code Editor:** Visual Studio Code
* **API Testing:** Thunder Client (VS Code Extension)
* **Version Control:** Git, GitHub

---

## 🚀 API Endpoints (Cars)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cars` | Retrieve all cars | `200 OK` |
| `GET` | `/api/cars/:id` | Retrieve a specific car by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/cars` | Add a new car | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/cars/:id` | Update an existing car | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/cars/:id` | Remove a car by ID | `204 No Content` / `404 Not Found` |