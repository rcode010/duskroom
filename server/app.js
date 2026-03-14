import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("message", (msg) => {
    console.log(socket.id,msg.data);
    socket.broadcast.emit("receive_message",msg.data)
  });
});

httpServer.listen(3000);
