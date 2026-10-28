// Fails if a migration that is already on main was modified, renamed or
// deleted. Databases that ran the old version would never see the change,
// so a schema change always needs a new migration. Run by CI on every PR.
const { execFileSync } = require("node:child_process");

const base = process.argv[2] ?? "origin/main";

// M = modified, D = deleted, R = renamed; added files are fine
const changed = execFileSync(
  "git",
  ["diff", "--name-only", "--diff-filter=MDR", `${base}...HEAD`, "--", "migrations/"],
  { encoding: "utf8" }
)
  .split("\n")
  .filter(Boolean);

if (changed.length > 0) {
  console.error("Migrations already on main must not change. Add a new migration instead.");
  for (const file of changed) {
    console.error(`  ${file}`);
  }
  process.exit(1);
}

console.log(`No migration on ${base} was changed.`);
