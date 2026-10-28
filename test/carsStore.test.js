const { createCarsStore } = require("../src/carsStore");
const { storeContract } = require("./storeContract");

storeContract("in-memory", async () => createCarsStore());
