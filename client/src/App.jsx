import { useState } from "react";
import socket from "./socket.js";
import { useEffect } from "react";
import Home from "./pages/Home.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<ChatRoom />} />
    </Routes>
  );
}

export default App;
