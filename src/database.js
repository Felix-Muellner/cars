const { Pool } = require("pg");

// the URL without the password, safe to print
function describeUrl(databaseUrl) {
  const url = new URL(databaseUrl);
  return `${url.protocol}//${url.host}${url.pathname}`;
}

function createPool(databaseUrl) {
  // without a timeout, pg waits forever for a connection when the database is down
  const pool = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5000 });

  // an idle connection that breaks (e.g. Postgres restarts) emits "error";
  // without a listener that would crash the app
  pool.on("error", (err) => {
    console.error("Idle database connection failed:", err.message);
  });

  return pool;
}

// rejects with a message that says what to do if the app cannot use the database
async function checkDatabase(pool, databaseUrl) {
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    // connecting to "localhost" can fail with an AggregateError that has no message
    throw new Error(
      `Cannot connect to the database at ${describeUrl(databaseUrl)}. Is it running? ` +
        `Cause: ${err.message || err.code}`,
      { cause: err }
    );
  }

  const { rows } = await pool.query("SELECT to_regclass('cars') AS cars_table");
  if (rows[0].cars_table === null) {
    throw new Error("The cars table does not exist. Run npm run migrate.");
  }
}

module.exports = { createPool, checkDatabase, describeUrl };
