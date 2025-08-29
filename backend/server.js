const http = require("http");
const app = require("./app");
const { initializeSocketConnection } = require("./socket");
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize socket.io and attach to the existing HTTP server

initializeSocketConnection(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
