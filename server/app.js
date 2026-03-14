import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createRoom, joinRoom, leaveRoom } from "./rooms.js";

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
    const result = joinRoom(roomId, socket.id, name);
    if (result === "full") {
      socket.emit("room_full");
    } else if (result === "not_found") {
      socket.emit("room_not_found");
    } else {
      socket.join(roomId);
      io.to(roomId).emit("user_joined", { name });
    }
  });
  socket.on("leaveRoom",({code,name})=>{
    leaveRoom(code,socket.id)
    socket.leave(code)
  })
});

httpServer.listen(3000);
