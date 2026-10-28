const path = require("node:path");
const { runner } = require("node-pg-migrate");

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

// applies every migration in migrations/ that has not run on this database yet
async function migrate(databaseUrl, { log = () => {} } = {}) {
  return runner({
    databaseUrl,
    dir: MIGRATIONS_DIR,
    direction: "up",
    migrationsTable: "pgmigrations",
    // refuse to run a new migration that sorts before one that already ran
    checkOrder: true,
    log,
  });
}

module.exports = { migrate };
