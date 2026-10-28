const { createApp } = require("./app");
const { createPool, checkDatabase } = require("./database");
const { createPgCarsStore } = require("./pgCarsStore");

const HOST = "127.0.0.1";
const PORT = 3000;

async function start() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set (see .env.example)");
    process.exit(1);
  }

  const pool = createPool(databaseUrl);
  try {
    await checkDatabase(pool, databaseUrl);
  } catch (err) {
    console.error(err.message);
    await pool.end();
    process.exit(1);
  }

  const app = createApp({ store: createPgCarsStore(pool) });
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}...`);
  });

  // finish open requests, then close the database connections
  const shutdown = () => {
    server.close(() => pool.end());
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

start();
