import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Home() {
  const [mode, setMode] = useState("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate random stars on mount (prevents hydration mismatch in SSR frameworks like Next.js)
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 80,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 5,
      opacity: 0.1 + Math.random() * 0.6,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  const navigate = useNavigate();

  const handleAction = (e) => {
    e.preventDefault();
    if (mode === "create") {
      const roomId = Math.floor(100000 + Math.random() * 900000).toString();
      setCode(roomId);
      console.log(roomId);
      socket.emit("createRoom", { roomId,name });
      navigate(`/room/${roomId}`, { state: { name } });
    } else {

      socket.emit("joinRoom", { code,name });
      navigate(`/room/${code}`, { state: { name } });
    }
  };

  return (
    <>
      {/* Custom Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: var(--o); transform: scale(1.2); }
        }
        @keyframes sunpulse {
          0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .animate-fade-up { animation: fadeUp 1s ease-out both; }
        .animate-sunpulse { animation: sunpulse 8s ease-in-out infinite; }
        .twinkle-star { animation: twinkle var(--d) ease-in-out infinite; }
        .pulse-dot { animation: pulseDot 3s ease-in-out infinite; }
      `}</style>

      <div className="relative min-h-screen w-full overflow-hidden bg-[#080c14] flex flex-col items-center justify-center px-6 gap-10">
        {/* BG grid - Added subtle opacity transition */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-80"
          style={{
            backgroundImage:
              "linear-gradient(rgba(80,130,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(80,130,255,0.03) 1px,transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* Dynamic Stars */}
        <div className="fixed inset-0 pointer-events-none z-0">
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
          className="fixed bottom-0 left-0 right-0 h-[45vh] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,50,120,0.18), transparent)",
          }}
        />

        {/* Sun glow - Now Breathing */}
        <div
          className="fixed rounded-full pointer-events-none z-0 animate-sunpulse"
          style={{
            width: 600,
            height: 600,
            bottom: -220,
            left: "50%",
            background:
              "radial-gradient(circle, rgba(60,100,220,0.15) 0%, rgba(30,60,160,0.08) 40%, transparent 70%)",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg">
          {/* Logo - Staggered entrance */}
          <div className="text-center flex flex-col items-center gap-4 animate-fade-up">
            <p className="text-xs tracking-[0.4em] uppercase text-blue-400/40 font-mono-dr">
              Private · Ephemeral · Forgotten
            </p>
            <h1 className="font-display italic font-light leading-none tracking-tight text-[#c8d8f0] text-[120px] drop-shadow-[0_0_30px_rgba(74,127,255,0.2)]">
              Dusk<span className="text-blue-500/80">room</span>
            </h1>
            <p className="text-sm tracking-[0.22em] uppercase text-[#c8d8f0]/25 font-mono-dr mt-2">
              Two people. One room. Then nothing.
            </p>
          </div>

          {/* Divider */}
          <div
            className="w-px h-10 animate-fade-up"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(74,127,255,0.4), transparent)",
              animationDelay: "0.15s",
            }}
          />

          {/* Card - Form added for "Enter" key submission support */}
          <form
            onSubmit={handleAction}
            className="w-full flex flex-col gap-6 rounded-sm p-10 backdrop-blur-xl bg-[rgba(10,18,40,0.75)] border border-blue-500/[0.15] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(30,60,160,0.08)] animate-fade-up transition-all duration-500 hover:border-blue-500/[0.25]"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Name input */}
            <div className="flex flex-col gap-2 group">
              <label className="text-[11px] tracking-[0.32em] uppercase text-blue-400/50 font-mono-dr transition-colors group-focus-within:text-blue-400/80">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="who are you tonight..."
                maxLength={20}
                className="w-full px-5 py-4 rounded-sm text-sm tracking-wide text-[#c8d8f0] placeholder:text-[#c8d8f0]/15 outline-none font-mono-dr bg-white/[0.03] border border-blue-500/[0.15] focus:border-blue-500/50 focus:bg-blue-500/[0.08] focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-sm overflow-hidden border border-blue-500/[0.12] bg-white/[0.02] p-1 gap-1">
              <button
                type="button"
                onClick={() => setMode("create")}
                className={`flex-1 py-3 text-[11px] tracking-[0.22em] uppercase font-mono-dr cursor-pointer transition-all duration-300 border-none rounded-sm
                  ${
                    mode === "create"
                      ? "bg-blue-500/[0.18] text-blue-300 shadow-[0_0_15px_rgba(74,127,255,0.1)]"
                      : "bg-transparent text-[#c8d8f0]/30 hover:text-[#c8d8f0]/60 hover:bg-white/[0.02]"
                  }`}
              >
                Create room
              </button>
              <button
                type="button"
                onClick={() => setMode("join")}
                className={`flex-1 py-3 text-[11px] tracking-[0.22em] uppercase font-mono-dr cursor-pointer transition-all duration-300 border-none rounded-sm
                  ${
                    mode === "join"
                      ? "bg-blue-500/[0.18] text-blue-300 shadow-[0_0_15px_rgba(74,127,255,0.1)]"
                      : "bg-transparent text-[#c8d8f0]/30 hover:text-[#c8d8f0]/60 hover:bg-white/[0.02]"
                  }`}
              >
                Join room
              </button>
            </div>

            {/* Dynamic Panel Content */}
            <div className="relative overflow-hidden transition-all duration-300 min-h-[56px]">
              {mode === "create" ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-sm text-[11px] tracking-[0.28em] uppercase font-mono-dr cursor-pointer transition-all duration-300 bg-blue-500/[0.18] border border-blue-500/[0.45] text-blue-300/90 hover:bg-blue-500/[0.35] hover:border-blue-500/80 hover:text-white hover:shadow-[0_0_20px_rgba(74,127,255,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none absolute inset-0"
                >
                  {isLoading ? "Opening..." : "Open a room →"}
                </button>
              ) : (
                <div className="flex gap-3 absolute inset-0">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // Numbers only
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 text-center py-4 rounded-sm text-xl tracking-[0.38em] text-[#c8d8f0] placeholder:text-[#c8d8f0]/15 outline-none font-mono-dr bg-white/[0.03] border border-blue-500/[0.15] focus:border-blue-500/50 focus:bg-blue-500/[0.08] focus:ring-1 focus:ring-blue-500/20 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || code.length < 6}
                    className="px-6 py-4 rounded-sm text-[11px] tracking-[0.22em] uppercase font-mono-dr cursor-pointer transition-all duration-300 bg-transparent border border-blue-500/[0.2] text-[#c8d8f0]/60 hover:bg-blue-500/15 hover:border-blue-500/50 hover:text-blue-200 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
                  >
                    {isLoading ? "..." : "Enter →"}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Footer - Pulsing dots */}
          <div
            className="flex items-center gap-4 text-[11px] tracking-[0.18em] text-[#c8d8f0]/20 font-mono-dr animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="w-1 h-1 rounded-full bg-blue-500/60 shrink-0 pulse-dot" />
            rooms vanish when both leave
            <span
              className="w-1 h-1 rounded-full bg-blue-500/60 shrink-0 pulse-dot"
              style={{ animationDelay: "1s" }}
            />
            no logs · no history
            <span
              className="w-1 h-1 rounded-full bg-blue-500/60 shrink-0 pulse-dot"
              style={{ animationDelay: "2s" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
