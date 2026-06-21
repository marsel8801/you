import { useState, useEffect, useRef } from "react";
import earnIt from "../../assets/earn-it.mp3";

const SCREENS = { ENVELOPE: "envelope", TODO: "todo", QUESTION: "question", RESULT: "result" };

const TG_TOKEN = "8638563764:AAF8cKbtFzVWOnrzB1e-GpOGHcyMRleyvp8";
const TG_CHAT_ID = "6983729735";

async function sendTelegram(text) {
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
  });
}

function Envelope({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FFF5F8", gap: "1.5rem" }}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.2s" }}
      >
        <svg width="220" height="160" viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="36" width="212" height="120" rx="10" fill="#FBEAF0" stroke="#D4537E" strokeWidth="2" />
          <polygon points="4,36 110,115 216,36" fill="none" stroke="#D4537E" strokeWidth="2" strokeLinejoin="round" />
          <line x1="4" y1="156" x2="76" y2="92" stroke="#D4537E" strokeWidth="1" />
          <line x1="216" y1="156" x2="144" y2="92" stroke="#D4537E" strokeWidth="1" />
          <text x="110" y="28" textAnchor="middle" fontSize="26">💌</text>
        </svg>
      </div>
      <p style={{ fontSize: 14, color: "#C06080", animation: "pulse 2s infinite" }}>нажми на конверт</p>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

function TodoCard({ onOpen }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FFF5F8" }}>
      <div style={{ background: "#fff", border: "1px solid #F4C0D1", borderRadius: 20, padding: "2.5rem 2rem", maxWidth: 360, width: "90%", boxShadow: "0 4px 32px #D4537E18", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 600, color: "#993556", marginBottom: "2rem", letterSpacing: -1 }}>Нурзина</h1>
        <p style={{ fontSize: 13, color: "#B07090", marginBottom: "1.5rem" }}>с уважением и заботой 🌸</p>
        <button
          onClick={onOpen}
          style={{ width: "100%", padding: "13px", borderRadius: 10, border: "1.5px solid #D4537E", background: "#FBEAF0", color: "#993556", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => (e.target.style.background = "#F4C0D1")}
          onMouseLeave={e => (e.target.style.background = "#FBEAF0")}
        >
          открыть
        </button>
      </div>
    </div>
  );
}

function Question({ onAnswer }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FFF5F8" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ fontSize: "1.4rem", fontWeight: 500, color: "#222", marginBottom: "2.5rem", lineHeight: 1.5 }}>ты что обиделась или нет?</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button
            onClick={() => onAnswer("да — обиделась")}
            style={{ padding: "13px 40px", borderRadius: 10, border: "1.5px solid #D4537E", background: "#FBEAF0", color: "#993556", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => (e.target.style.background = "#F4C0D1")}
            onMouseLeave={e => (e.target.style.background = "#FBEAF0")}
          >
            да
          </button>
          <button
            onClick={() => onAnswer("нет — не обиделась")}
            style={{ padding: "13px 40px", borderRadius: 10, border: "1.5px solid #ddd", background: "#f5f5f5", color: "#333", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => (e.target.style.background = "#eaeaea")}
            onMouseLeave={e => (e.target.style.background = "#f5f5f5")}
          >
            нет
          </button>
        </div>
      </div>
    </div>
  );
}

function Result({ answer }) {
  const isYes = answer === "да — обиделась";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FFF5F8" }}>
      <div style={{ textAlign: "center" }}>
        {isYes ? (
          <>
            <div style={{ fontSize: "6rem" }}>😔</div>
            <div style={{ fontSize: "3.5rem", fontWeight: 700, color: "#993556", marginTop: "0.5rem" }}>sorry</div>
            <div style={{ fontSize: "1rem", color: "#B07090", marginTop: "0.5rem" }}>я правда сожалею</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "7rem" }}>👍</div>
            <div style={{ fontSize: "2rem", fontWeight: 600, color: "#333", marginTop: "0.5rem" }}>всё хорошо!</div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState(SCREENS.ENVELOPE);
  const [answer, setAnswer] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(earnIt);
    audio.loop = true;
    audio.volume = 0.6;
    audio.play().catch(() => {});
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const handleAnswer = (val) => {
    setAnswer(val);
    setScreen(SCREENS.RESULT);
    sendTelegram(`💌 Нурзина ответила: ${val}`).catch(console.error);
  };

  return (
    <>
      {screen === SCREENS.ENVELOPE && <Envelope onClick={() => setScreen(SCREENS.TODO)} />}
      {screen === SCREENS.TODO && <TodoCard onOpen={() => setScreen(SCREENS.QUESTION)} />}
      {screen === SCREENS.QUESTION && <Question onAnswer={handleAnswer} />}
      {screen === SCREENS.RESULT && <Result answer={answer} />}
    </>
  );
}
