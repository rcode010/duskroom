import { useState } from "react";
import "./App.css";
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000")

function App() {
  const [message, setMessage]= useState("");
  const sendMessage = ()=>{
    socket.emit("message",{data:message})
  }
  return (
    <>
      <input
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>send</button>
    </>
  );
}

export default App;
