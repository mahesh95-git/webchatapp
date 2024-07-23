const express = require("express");
const next = require("next");
const http = require("http");
const socketIo = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("message", (message) => {
      console.log("Message received: ", message);
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, (err) => {
    if (err) {
      console.error("Error starting server:", err);
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
});
