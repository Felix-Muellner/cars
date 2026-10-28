// npm run db:seed: adds the example cars to the DATABASE_URL database if it has no cars
const { createPool } = require("../src/database");
const { seed } = require("../src/seed");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set (see .env.example)");
  process.exit(1);
}

const pool = createPool(databaseUrl);

seed(pool)
  .then((added) => {
    console.log(added > 0 ? `Added ${added} example cars.` : "The cars table is not empty, nothing to seed.");
  })
  .catch((err) => {
    console.error(`Seeding failed: ${err.message || err.code}`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
