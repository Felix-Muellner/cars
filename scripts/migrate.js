// npm run migrate: brings the DATABASE_URL database up to date
const { migrate } = require("../src/migrate");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set (see .env.example)");
  process.exit(1);
}

migrate(databaseUrl, { log: console.log }).catch((err) => {
  console.error(`Migration failed: ${err.message}`);
  process.exit(1);
});
