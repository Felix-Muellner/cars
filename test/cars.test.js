const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");

const validCar = { make: "Ford", model: "Mustang", year: 2022 };

describe("GET /api/cars", () => {
  test("returns 200 with all cars", async () => {
    const res = await request(createApp()).get("/api/cars");

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, [
      { id: 1, make: "Toyota", model: "Corolla", year: 2020 },
      { id: 2, make: "Honda", model: "Civic", year: 2021 },
    ]);
  });
});

describe("GET /api/cars/:id", () => {
  test("returns 200 with the car", async () => {
    const res = await request(createApp()).get("/api/cars/1");

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { id: 1, make: "Toyota", model: "Corolla", year: 2020 });
  });

  test("returns 404 for an unknown id", async () => {
    const res = await request(createApp()).get("/api/cars/999");

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: "Car not found" });
  });
});

describe("POST /api/cars", () => {
  test("returns 201 with the created car", async () => {
    const res = await request(createApp()).post("/api/cars").send(validCar);

    assert.equal(res.status, 201);
    assert.deepEqual(res.body, { id: 3, ...validCar });
  });

  test("returns 400 when a required field is missing", async () => {
    const res = await request(createApp())
      .post("/api/cars")
      .send({ make: "Ford", model: "Mustang" });

    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { message: "Make, model and year are required" });
  });
});

describe("PUT /api/cars/:id", () => {
  test("returns 200 with the updated car", async () => {
    const res = await request(createApp()).put("/api/cars/1").send(validCar);

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { id: 1, ...validCar });
  });

  test("returns 400 when a required field is missing", async () => {
    const res = await request(createApp())
      .put("/api/cars/1")
      .send({ make: "Ford" });

    assert.equal(res.status, 400);
    assert.deepEqual(res.body, { message: "Make, model and year are required" });
  });

  test("returns 404 for an unknown id", async () => {
    const res = await request(createApp()).put("/api/cars/999").send(validCar);

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: "Car not found" });
  });
});

describe("DELETE /api/cars/:id", () => {
  test("returns 204 with no content", async () => {
    const res = await request(createApp()).delete("/api/cars/1");

    assert.equal(res.status, 204);
    assert.equal(res.text, "");
  });

  test("returns 404 for an unknown id", async () => {
    const res = await request(createApp()).delete("/api/cars/999");

    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: "Car not found" });
  });
});
