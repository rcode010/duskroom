import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative z-10 flex items-center gap-2.5 px-5 py-4 border-t border-blue-500/[0.1] bg-[rgba(8,12,20,0.85)] backdrop-blur-xl">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="say something before it fades..."
        className="flex-1 px-4 py-3 rounded-lg text-[13px] tracking-wide text-[#c8d8f0] placeholder:text-[#c8d8f0]/20 outline-none font-mono-dr bg-white/[0.02] border border-blue-500/[0.15] focus:border-blue-500/50 focus:bg-blue-500/[0.08] focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
      />
      <button
        onClick={handleSend}
        disabled={!inputValue.trim()}
        className="px-6 py-3 rounded-lg text-[10px] tracking-[0.2em] uppercase font-mono-dr cursor-pointer transition-all duration-300 bg-blue-500/[0.18] border border-blue-500/[0.45] text-blue-300/90 hover:bg-blue-500/[0.35] hover:border-blue-500/80 hover:text-white hover:shadow-[0_0_20px_rgba(74,127,255,0.3)] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap shrink-0"
      >
        Send →
      </button>
    </div>
  );
};

export default MessageInput;
