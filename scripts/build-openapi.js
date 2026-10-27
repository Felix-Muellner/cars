// Writes the spec generated from the @openapi annotations to openapi.json,
// so that `npm run lint:api` can lint it
const fs = require("node:fs");
const path = require("node:path");
const openapiSpec = require("../src/openapi");

fs.writeFileSync(
  path.join(__dirname, "..", "openapi.json"),
  JSON.stringify(openapiSpec, null, 2) + "\n"
);
