import { useState, useEffect, useRef } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 65,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.2,
    animationDuration: Math.random() * 4 + 3,
    animationDelay: Math.random() * 5,
  }));
}

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stars = useRef<Star[]>(generateStars(120));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  function handleSubmit() {
    if (!email.trim()) {
      inputRef.current?.focus();
      return;
    }
    setSubmitted(true);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center">

      {/* ── Stars ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <style>{`
            @keyframes twinkle {
              0%, 100% { opacity: var(--op-start); }
              50%       { opacity: var(--op-end); }
            }
          `}</style>
        </defs>
        {stars.current.map((s) => (
          <circle
            key={s.id}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.size}
            fill="white"
            style={{
              ["--op-start" as string]: s.opacity,
              ["--op-end" as string]: Math.max(0.05, s.opacity - 0.4),
              opacity: s.opacity,
              animation: `twinkle ${s.animationDuration}s ${s.animationDelay}s ease-in-out infinite`,
            }}
          />
        ))}
      </svg>

      {/* ── Planet / Horizon ── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none">
        {/* Planet body — large dark ellipse rising from the bottom */}
        <div
          className="absolute"
          style={{
            bottom: "-38vw",
            left: "50%",
            transform: "translateX(-50%)",
            width: "130vw",
            height: "60vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #0d0615 40%, #080010 70%, #000 100%)",
          }}
        />

        {/* Purple/violet atmospheric glow on top of planet */}
        <div
          className="absolute"
          style={{
            bottom: "-38vw",
            left: "50%",
            transform: "translateX(-50%)",
            width: "130vw",
            height: "60vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 10%, rgba(120,60,200,0.55) 0%, rgba(80,20,150,0.3) 25%, transparent 55%)",
          }}
        />

        {/* Bright white horizon rim */}
        <div
          className="absolute"
          style={{
            bottom: "-38vw",
            left: "50%",
            transform: "translateX(-50%)",
            width: "130vw",
            height: "60vw",
            borderRadius: "50%",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.7), 0 0 12px 4px rgba(255,255,255,0.25), 0 0 40px 10px rgba(200,180,255,0.15)",
          }}
        />

        {/* Bloom from the center of the horizon — the "sun" behind the planet */}
        {/* <div
          className="absolute"
          style={{
            bottom: "calc(37vw - 2px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "240px",
            height: "80px",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(230,210,255,0.6) 30%, rgba(140,80,220,0.2) 65%, transparent 100%)",
            filter: "blur(6px)",
          }}
        /> */}

        {/* Teal atmospheric rim on the left side */}
        <div
          className="absolute"
          style={{
            bottom: "-38vw",
            left: "50%",
            transform: "translateX(-50%) rotate(-8deg)",
            width: "130vw",
            height: "60vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 20% 8%, rgba(0,180,160,0.18) 0%, transparent 35%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 flex flex-col items-center gap-5 px-6 text-center mt-32"
        style={{
          transform: mounted ? "translateY(0)" : "translateY(18px)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        {/* Title */}
        <h1
          className="text-white font-light tracking-wide select-none"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 3.6rem)",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: "0.04em",
            textShadow: "0 0 40px rgba(180,140,255,0.3)",
          }}
        >
          Riften Digital
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/55 text-sm tracking-wide"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.02em" }}
        >
          Currently onboarding early partners.
        </p>

        {/* Email form */}
        {!submitted ? (
          <div
            className="flex mt-2 overflow-hidden"
            style={{
              borderRadius: "6px",
              boxShadow: focused
                ? "0 0 0 2px rgba(160,120,240,0.4), 0 8px 32px rgba(0,0,0,0.5)"
                : "0 4px 24px rgba(0,0,0,0.4)",
              transition: "box-shadow 0.2s ease",
              width: "min(340px, 88vw)",
            }}
          >
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKey}
              placeholder="Your Email Address"
              aria-label="Email address"
              className="flex-1 text-sm text-white/90 outline-none px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRight: "none",
                borderRadius: "6px 0 0 6px",
                fontFamily: "inherit",
                fontSize: "0.875rem",
              }}
            />
            <button
              onClick={handleSubmit}
              className="px-5 text-sm font-medium text-gray-900 whitespace-nowrap transition-all duration-150 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.93)",
                border: "1px solid rgba(255,255,255,0.93)",
                borderLeft: "none",
                borderRadius: "0 6px 6px 0",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                letterSpacing: "0.01em",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,1)")
              }
              onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.93)")
              }
            >
              Get Started
            </button>
          </div>
        ) : (
          <div
            className="mt-2 px-8 py-3 text-sm text-white/70"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "6px",
              backdropFilter: "blur(12px)",
              fontFamily: "'Georgia', serif",
              letterSpacing: "0.02em",
            }}
          >
            ✦ &nbsp;You're on the list. We'll be in touch.
          </div>
        )}
      </div>

      {/* ── Very subtle vignette overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
