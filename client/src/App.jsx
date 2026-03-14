import { useState } from "react";
import "./App.css";
import { io } from 'socket.io-client';
import { useEffect } from "react";

const socket = io("http://localhost:3000")

function App() {
  const [message, setMessage]= useState("");
    const [messageRecieved, setmMssageRecieved]= useState("");

  const sendMessage = ()=>{
    socket.emit("message",{data:message})
  }
  useEffect(()=>{
    socket.on('receive_message',(data)=>{
      setmMssageRecieved(data)
    })
  },[socket])
  return (
    <>
      <input
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>send</button>
      <p>{messageRecieved}</p>
    </>
  );
}

export default App;
