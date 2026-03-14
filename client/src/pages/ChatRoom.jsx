import React, { useState, useEffect, useRef } from "react";
import socket from "../socket.js";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const ChatRoom = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const { name } = state;
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");
  const [messageRecieved, setmMssageRecieved] = useState("");

  useEffect(() => {
    console.log(roomId)
    socket.emit("joinRoom", { roomId, name });
    socket.on("user_joined", ({ name }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: "system", text: `${name} joined the room` },
      ]);
    });
    socket.on("receive_message", ({ text, senderName, time }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: "theirs", name: senderName, text, time },
      ]);
    });
  }, []);

  const [inputValue, setInputValue] = useState(""); // ✅ Fix 3: controlled input state
  const messagesEndRef = useRef(null); // ✅ Fix 4: for auto-scroll

  // ✅ Fix 5: Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fix 7: Send message handler
  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Optimistically add to local state
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "mine",
        name: "you",
        text,
        time,
      },
    ]);

    // Emit to server
    socket.emit("send-message", { roomId, senderName: name, text, time });

    setInputValue("");
  };

  // ✅ Fix 8: Send on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative p-10 h-screen w-full overflow-hidden bg-[#080c14] flex flex-col font-mono-dr">
      {/* BG grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,130,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(80,130,255,0.03) 1px,transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* Horizon glow */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[35vh] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(to top, rgba(20,50,120,0.12), transparent)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-blue-500/[0.1] bg-[rgba(8,12,20,0.8)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h1 className="font-display italic font-light text-2xl text-[#c8d8f0]">
            Dusk<span className="text-blue-500/80">room</span>
          </h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-blue-500/[0.08] border border-blue-500/[0.2]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-pulse" />
            <span className="text-[11px] tracking-[0.2em] text-blue-300/70">
              {roomId}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-[10px] tracking-[0.2em] text-[#c8d8f0]/25 uppercase">
            2 / 2 in room
          </span>
          <button
            onClick={() => navigate("/")} // ✅ Fix 1 applied here
            className="px-4 py-1.5 rounded-sm text-[10px] tracking-[0.2em] uppercase bg-transparent border border-red-500/[0.2] text-red-400/40 hover:bg-red-500/[0.08] hover:border-red-500/40 hover:text-red-300/80 transition-all duration-200 cursor-pointer"
          >
            Leave →
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
        {messages.map((msg) => {
          if (msg.type === "system") {
            return (
              <div
                key={msg.id}
                className="self-center text-[10px] tracking-[0.2em] uppercase text-[#c8d8f0]/20 px-4 py-1.5 rounded-sm border border-white/[0.05]"
              >
                {msg.text}
              </div>
            );
          }

          const isMine = msg.type === "mine";
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-[3px] max-w-[68%] ${isMine ? "self-end items-end" : "self-start items-start"}`}
            >
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#c8d8f0]/20">
                {msg.name}
              </span>
              <div
                className={`px-4 py-2.5 text-[13px] leading-relaxed tracking-wide ${
                  isMine
                    ? "bg-blue-500/[0.14] border border-blue-500/[0.25] text-[#c8d8f0] rounded-lg rounded-br-none"
                    : "bg-white/[0.04] border border-white/[0.08] text-[#c8d8f0]/80 rounded-lg rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#c8d8f0]/15 tracking-wide">
                {msg.time}
              </span>
            </div>
          );
        })}
        {/* ✅ Fix 4: Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="relative z-10 flex items-center gap-2.5 px-5 py-3.5 border-t border-blue-500/[0.1] bg-[rgba(8,12,20,0.8)] backdrop-blur-xl">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="say something before it fades..."
          className="flex-1 px-4 py-2.5 rounded-lg text-[13px] tracking-wide text-[#c8d8f0] placeholder:text-[#c8d8f0]/15 outline-none font-mono-dr bg-white/[0.03] border border-blue-500/[0.15] focus:border-blue-500/40 focus:bg-blue-500/[0.05] transition-colors duration-200"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2.5 rounded-lg text-[10px] tracking-[0.2em] uppercase font-mono-dr cursor-pointer transition-all duration-200 bg-blue-500/[0.18] border border-blue-500/[0.45] text-blue-300/90 hover:bg-blue-500/[0.3] hover:text-white active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          Send →
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
