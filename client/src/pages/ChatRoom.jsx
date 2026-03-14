import React, { useState, useEffect } from "react";
import socket from "../socket.js";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import MessageList from "../components/MessageList.jsx";
import MessageInput from "../components/MessageInput.jsx";

const ChatRoom = () => {
  const { roomId } = useParams();
  const { state } = useLocation();
  const { name } = state || { name: "Anonymous" };
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [stars, setStars] = useState([]);

  // Generate background stars
  useEffect(() => {
    const generatedStars = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 80,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 6,
      opacity: 0.1 + Math.random() * 0.4,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    socket.on("user_joined", ({ name }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), type: "system", text: `${name} joined the room` },
      ]);
    });

    socket.on("user_left", ({ name }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), type: "system", text: `${name} faded away` },
      ]);
    });

    socket.on("receive_message", ({ text, senderName, time }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), type: "theirs", name: senderName, text, time },
      ]);
    });

    socket.emit("joinRoom", { roomId, name });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("receive_message");
    };
  }, [roomId, name]);

  const handleSendMessage = (text) => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    socket.emit("message", { roomId, text, senderName: name, time });
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), type: "mine", name: "you", text, time },
    ]);
  };

  const handleLeave = () => {
    socket.emit("leaveRoom", { code: roomId, name });
    navigate("/");
  };

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: var(--o); transform: scale(1.2); }
        }
        @keyframes fadeUpMsg {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up-msg { animation: fadeUpMsg 0.4s ease-out forwards; }
        .twinkle-star { animation: twinkle var(--d) ease-in-out infinite; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 127, 255, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 127, 255, 0.3);
        }
      `}</style>

      <div className="relative h-screen w-full overflow-hidden bg-[#080c14] flex flex-col font-mono-dr">
        {/* BG grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,130,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(80,130,255,0.03) 1px,transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Dynamic Stars */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-blue-100 twinkle-star"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                "--d": `${star.duration}s`,
                "--o": star.opacity,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Horizon glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[35vh] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,50,120,0.12), transparent)",
          }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-blue-500/[0.1] bg-[rgba(8,12,20,0.8)] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
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
              Connected
            </span>
            <button
              onClick={handleLeave}
              className="px-4 py-1.5 rounded-sm text-[10px] tracking-[0.2em] uppercase bg-transparent border border-red-500/[0.2] text-red-400/50 hover:bg-red-500/[0.1] hover:border-red-500/50 hover:text-red-300 transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              Leave →
            </button>
          </div>
        </div>

        {/* Chat Area Container */}
        <div className="relative z-10 flex-1 flex flex-col mx-auto w-full max-w-4xl bg-black/[0.2] border-x border-blue-500/[0.05] shadow-[0_0_50px_rgba(0,0,0,0.3)]">
          {/* Main List */}
          <MessageList messages={messages} />

          {/* Input Area */}
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
