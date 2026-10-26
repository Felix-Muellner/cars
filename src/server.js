const express = require("express");
const app = express();

const HOST = "127.0.0.1";
const PORT = 3000;

app.use(express.json());

// temporary in-memory data store for project phase 1
let cars = [
  { id: 1, make: "Toyota", model: "Corolla", year: 2020 },
  { id: 2, make: "Honda", model: "Civic", year: 2021 },
];

let nextId = 3;

app.get('/api/cars', (req, res) => {
  res.status(200).json(cars);
});

app.get('/api/cars/:id', (req, res) => {
    const carId = parseInt(req.params.id, 10);
    const car = cars.find((c) => c.id === carId);

    if (!car) {
        return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
});

app.post('/api/cars', (req, res) => {
    const { make, model, year } = req.body;

    if (!make || !model || !year) {
        return res.status(400).json({ message: "Make, model and year are required"})
    }

    const newCar = {
        id: nextId++,
        make,
        model,
        year,
    }

    cars.push(newCar);

    res.status(201).json(newCar);
})

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}...`);
});
