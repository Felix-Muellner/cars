const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapiSpec = require("./openapi");
const { createCarsStore, seedCars } = require("./carsStore");
const { validateCarInput, parseCarId } = require("./validation");

function createApp({ store = createCarsStore(seedCars) } = {}) {
  const app = express();

  app.use(express.json());

  app.get("/api-docs.json", (req, res) => {
    res.json(openapiSpec);
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

  /**
   * @openapi
   * components:
   *   parameters:
   *     CarId:
   *       name: id
   *       in: path
   *       required: true
   *       description: Positive integer car id
   *       schema:
   *         type: integer
   *       example: 1
   *   schemas:
   *     Car:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           example: 1
   *         make:
   *           type: string
   *           example: Toyota
   *         model:
   *           type: string
   *           example: Corolla
   *         year:
   *           type: integer
   *           example: 2020
   *     CarInput:
   *       type: object
   *       required: [make, model, year]
   *       properties:
   *         make:
   *           type: string
   *           example: Ford
   *         model:
   *           type: string
   *           example: Mustang
   *         year:
   *           type: integer
   *           example: 2022
   *     Error:
   *       type: object
   *       properties:
   *         message:
   *           type: string
   *           example: Car not found
   *     ValidationError:
   *       type: object
   *       properties:
   *         message:
   *           type: string
   *           example: Invalid car
   *         errors:
   *           type: array
   *           items:
   *             type: string
   *           example: [year must be an integer from 1886 to next year]
   *   responses:
   *     InvalidCarId:
   *       description: The id is not a positive integer
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Error'
   *           example:
   *             message: Invalid car id
   *     InvalidCar:
   *       description: make or model is not a non-empty string, or year is not an integer from 1886 to next year
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ValidationError'
   */

  /**
   * @openapi
   * /api/cars:
   *   get:
   *     tags: [Cars]
   *     summary: List all cars
   *     responses:
   *       200:
   *         description: All cars in the store
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Car'
   */
  app.get('/api/cars', (req, res) => {
    res.status(200).json(store.list());
  });

  /**
   * @openapi
   * /api/cars/{id}:
   *   get:
   *     tags: [Cars]
   *     summary: Get a car by id
   *     parameters:
   *       - $ref: '#/components/parameters/CarId'
   *     responses:
   *       200:
   *         description: The requested car
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Car'
   *       400:
   *         $ref: '#/components/responses/InvalidCarId'
   *       404:
   *         description: Car not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.get('/api/cars/:id', (req, res) => {
      const carId = parseCarId(req.params.id);
      if (carId === undefined) {
          return res.status(400).json({ message: "Invalid car id" });
      }

      const car = store.get(carId);

      if (!car) {
          return res.status(404).json({ message: "Car not found" });
      }

      res.status(200).json(car);
  });

  /**
   * @openapi
   * /api/cars:
   *   post:
   *     tags: [Cars]
   *     summary: Create a car
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CarInput'
   *     responses:
   *       201:
   *         description: The created car
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Car'
   *       400:
   *         $ref: '#/components/responses/InvalidCar'
   */
  app.post('/api/cars', (req, res) => {
      const { car, errors } = validateCarInput(req.body);
      if (!car) {
          return res.status(400).json({ message: "Invalid car", errors });
      }

      const newCar = store.create(car);

      res.status(201).json(newCar);
  });

  /**
   * @openapi
   * /api/cars/{id}:
   *   put:
   *     tags: [Cars]
   *     summary: Replace a car
   *     parameters:
   *       - $ref: '#/components/parameters/CarId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CarInput'
   *     responses:
   *       200:
   *         description: The updated car
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Car'
   *       400:
   *         description: The id is not a positive integer (message "Invalid car id"), or the body is invalid (message "Invalid car" with errors)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationError'
   *       404:
   *         description: Car not found (checked after the id and before the body is validated)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.put('/api/cars/:id', (req, res) => {
      const carId = parseCarId(req.params.id);
      if (carId === undefined) {
          return res.status(400).json({ message: "Invalid car id" });
      }

      if (!store.get(carId)) {
          return res.status(404).json({ message: "Car not found" });
      }

      const { car, errors } = validateCarInput(req.body);
      if (!car) {
          return res.status(400).json({ message: "Invalid car", errors });
      }

      const updatedCar = store.update(carId, car);

      res.status(200).json(updatedCar);
  });

  /**
   * @openapi
   * /api/cars/{id}:
   *   delete:
   *     tags: [Cars]
   *     summary: Delete a car
   *     parameters:
   *       - $ref: '#/components/parameters/CarId'
   *     responses:
   *       204:
   *         description: Car deleted, no content
   *       400:
   *         $ref: '#/components/responses/InvalidCarId'
   *       404:
   *         description: Car not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.delete('/api/cars/:id', (req, res) => {
      const carId = parseCarId(req.params.id);
      if (carId === undefined) {
          return res.status(400).json({ message: "Invalid car id" });
      }

      if (!store.remove(carId)) {
          return res.status(404).json({ message: "Car not found" });
      }

      res.status(204).send();
  })

  return app;
}

module.exports = { createApp };
