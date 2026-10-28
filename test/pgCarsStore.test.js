// All tests that need Postgres live in this one file: node --test runs files
// in parallel, and every test here empties the cars table of cars_test.
const { test, describe, before, beforeEach, after } = require("node:test");
const assert = require("node:assert/strict");
const { Pool } = require("pg");
const { migrate } = require("../src/migrate");

// the URL without the password, safe to print
function describeUrl(databaseUrl) {
  const url = new URL(databaseUrl);
  return `${url.protocol}//${url.host}${url.pathname}`;
}

// returns a pool for databaseUrl, or rejects with one clear message
async function connectToTestDatabase(databaseUrl) {
  if (!databaseUrl) {
    throw new Error("TEST_DATABASE_URL is not set (see .env.example)");
  }

  const pool = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5000 });
  try {
    await pool.query("SELECT 1");
  } catch (err) {
    await pool.end();
    throw new Error(
      `Cannot reach Postgres at ${describeUrl(databaseUrl)}. Is the database running? ` +
        "(Codespace: rebuild the container. CI: check the postgres service.) " +
        // connecting to "localhost" can fail with an AggregateError that has no message
        `Cause: ${err.message || err.code}`,
      { cause: err }
    );
  }
  return pool;
}

test("connecting to an unreachable database fails with one clear message", async () => {
  await assert.rejects(connectToTestDatabase("postgres://cars:secret@127.0.0.1:1/cars_test"), {
    message: /^Cannot reach Postgres at postgres:\/\/127\.0\.0\.1:1\/cars_test\. Is the database running\?/,
  });
});

describe("postgres", () => {
  let pool;

  before(async () => {
    pool = await connectToTestDatabase(process.env.TEST_DATABASE_URL);
    await migrate(process.env.TEST_DATABASE_URL);
  });

  beforeEach(async () => {
    await pool.query("TRUNCATE cars RESTART IDENTITY");
  });

  after(async () => {
    await pool?.end();
  });

  describe("cars table", () => {
    const insert = (make, model, year) =>
      pool.query("INSERT INTO cars (make, model, year) VALUES ($1, $2, $3) RETURNING *", [make, model, year]);

    test("accepts a valid car and assigns id 1", async () => {
      const { rows } = await insert("Ford", "Mustang", 2022);

      assert.deepEqual(rows, [{ id: 1, make: "Ford", model: "Mustang", year: 2022 }]);
    });

    test("accepts make and model of exactly 100 characters", async () => {
      await insert("a".repeat(100), "🚗".repeat(100), 2022);
    });

    test("rejects a blank make or model", async () => {
      await assert.rejects(insert("  ", "Mustang", 2022), { code: "23514" });
      await assert.rejects(insert("Ford", "", 2022), { code: "23514" });
    });

    test("rejects a year before 1886", async () => {
      await assert.rejects(insert("Ford", "Mustang", 1885), { code: "23514" });
    });

    test("rejects a make of 101 characters", async () => {
      // 22001: value too long for type character varying(100)
      await assert.rejects(insert("a".repeat(101), "Mustang", 2022), { code: "22001" });
    });

    test("rejects a missing field", async () => {
      // 23502: not-null violation
      await assert.rejects(insert("Ford", null, 2022), { code: "23502" });
    });

    test("rejects an id chosen by the client", async () => {
      // 428C9: cannot insert a non-DEFAULT value into a GENERATED ALWAYS column
      await assert.rejects(
        pool.query("INSERT INTO cars (id, make, model, year) VALUES (99, 'Ford', 'Mustang', 2022)"),
        { code: "428C9" }
      );
    });
  });
});
