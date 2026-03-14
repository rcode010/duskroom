import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createRoom, joinRoom, leaveRoom, handleDisconnect } from "./rooms.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("createRoom", (el) => {
    createRoom(el.roomId, el.name, socket.id);
    socket.join(el.roomId);
  });
  socket.on("joinRoom", ({ roomId, name }) => {
    console.log("join room emoit");
    const result = joinRoom(roomId, socket.id, name);
    console.log(result);
    if (result === "full") {
      socket.emit("room_full");
    } else if (result === "not_found") {
      socket.emit("room_not_found");
    } else {
      socket.join(roomId);
      io.to(roomId).emit("user_joined", { name });
    }
  });
  socket.on("leaveRoom", ({ code, name }) => {
    leaveRoom(code, socket.id);
    socket.leave(code);
    socket.to(code).emit("user_left", { name });
  });
  
  socket.on("disconnect", () => {
    const disconnectedRooms = handleDisconnect(socket.id);
    disconnectedRooms.forEach(({ roomId, name }) => {
      socket.to(roomId).emit("user_left", { name });
    });
  });
  socket.on("message", ({ roomId, text, senderName, time }) => {
    socket.to(roomId).emit("receive_message", { text, senderName, time });
  });
});

httpServer.listen(3000);
