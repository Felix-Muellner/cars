const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cars API",
      version: "1.0.0",
      description:
        "A lightweight RESTful API for managing car inventory data.",
      license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
    },
    servers: [{ url: "http://127.0.0.1:3000" }],
    tags: [{ name: "Cars", description: "Car inventory operations" }],
    // the API has no authentication
    security: [],
  },
  apis: [`${__dirname}/app.js`],
};

module.exports = swaggerJsdoc(options);
