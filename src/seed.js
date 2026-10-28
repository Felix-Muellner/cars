const { seedCars } = require("./carsStore");

// adds the example cars only when the table is empty, so a developer's own
// cars are never touched; returns how many cars were added
async function seed(pool) {
  // one statement: enough for one developer; two seeds at the same moment
  // could both see an empty table, but only the Codespace start runs it
  const { rowCount } = await pool.query(
    `INSERT INTO cars (make, model, year)
     SELECT * FROM unnest($1::text[], $2::text[], $3::integer[])
     WHERE NOT EXISTS (SELECT 1 FROM cars)`,
    [seedCars.map((car) => car.make), seedCars.map((car) => car.model), seedCars.map((car) => car.year)]
  );
  return rowCount;
}

module.exports = { seed };
