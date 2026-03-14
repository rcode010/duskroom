import React, { useEffect, useRef } from "react";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#c8d8f0]/20 text-[11px] tracking-[0.2em] font-mono-dr uppercase animate-pulse">
            Waiting for messages...
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          if (msg.type === "system") {
            return (
              <div
                key={msg.id}
                className="self-center text-[10px] tracking-[0.2em] uppercase text-[#c8d8f0]/40 px-4 py-1.5 rounded-sm border border-white/[0.05] bg-white/[0.02] animate-fade-up-msg"
              >
                {msg.text}
              </div>
            );
          }

          const isMine = msg.type === "mine";
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-[3px] max-w-[68%] animate-fade-up-msg ${
                isMine ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#c8d8f0]/30">
                {msg.name}
              </span>
              <div
                className={`px-4 py-2.5 text-[13px] leading-relaxed tracking-wide shadow-sm ${
                  isMine
                    ? "bg-blue-500/[0.18] border border-blue-500/[0.3] text-[#e0ecff] rounded-lg rounded-br-none shadow-[0_4px_20px_rgba(74,127,255,0.1)] backdrop-blur-sm"
                    : "bg-[rgba(20,25,35,0.6)] border border-white/[0.08] text-[#c8d8f0]/90 rounded-lg rounded-bl-none backdrop-blur-sm"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#c8d8f0]/20 tracking-wide mt-0.5">
                {msg.time}
              </span>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} className="h-1 text-transparent">-</div>
    </div>
  );
};

export default MessageList;
