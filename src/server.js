const { createApp } = require("./app");
const app = createApp();

const HOST = "127.0.0.1";
const PORT = 3000;

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}...`);
});
