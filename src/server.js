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

app.get('/api/cars', (req, res) => {
  res.status(200).json(cars);
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}...`);
});
