import { useState, useEffect, useCallback } from "react";
import { questions } from "./lib/data/questions";

const TOPICS = ["All", ...Array.from(new Set(questions.map(q => q.topic)))];
const LETTERS = ["A", "B", "C", "D"];

export default function App() {
  const [topicFilter, setTopicFilter] = useState("All");
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [shake, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [mode, setMode] = useState("start"); // start | quiz | summary

  const buildDeck = useCallback((filter) => {
    const filtered = filter === "All" ? questions : questions.filter(q => q.topic === filter);
    return [...filtered].sort(() => Math.random() - 0.5);
  }, []);

  const startQuiz = () => {
    const d = buildDeck(topicFilter);
    setDeck(d);
    setIdx(0);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setBestStreak(0);
    setMode("quiz");
  };

  const handleSelect = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === deck[idx].ans;
    const newStreak = correct ? streak + 1 : 0;
    const newBest = Math.max(newStreak, bestStreak);
    setStreak(newStreak);
    setBestStreak(newBest);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (!correct) { setShake(true); setTimeout(() => setShake(false), 500); }
    else { setPulse(true); setTimeout(() => setPulse(false), 400); }
  };

  const next = () => {
    if (idx + 1 >= deck.length) { setMode("summary"); return; }
    setIdx(i => i + 1);
    setSelected(null);
  };

  const current = deck[idx];
  const progress = deck.length ? ((idx + (selected !== null ? 1 : 0)) / deck.length) * 100 : 0;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #f0eee8; font-family: 'Syne', sans-serif; min-height: 100vh; }
    .app { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; background: radial-gradient(ellipse at 20% 20%, #1a0a2e 0%, #0a0a0f 50%, #0a0f1a 100%); }
    .noise { position: fixed; inset: 0; opacity: 0.03; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px; z-index: 0; }

    /* START SCREEN */
    .start-screen { text-align: center; max-width: 560px; width: 100%; }
    .logo { font-size: 11px; font-family: 'Space Mono', monospace; letter-spacing: 4px; color: #6b63ff; text-transform: uppercase; margin-bottom: 24px; }
    .start-title { font-size: clamp(36px, 6vw, 56px); font-weight: 800; line-height: 1.05; margin-bottom: 12px; background: linear-gradient(135deg, #f0eee8 30%, #6b63ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .start-sub { font-size: 15px; color: #888; margin-bottom: 40px; line-height: 1.6; }
    .topic-label { font-size: 11px; letter-spacing: 3px; color: #555; text-transform: uppercase; font-family: 'Space Mono', monospace; margin-bottom: 12px; }
    .topic-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 36px; }
    .topic-btn { padding: 7px 14px; border-radius: 6px; border: 1px solid #2a2a3a; background: #111118; color: #888; font-family: 'Syne', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.15s; }
    .topic-btn:hover { border-color: #6b63ff; color: #c0bcff; }
    .topic-btn.active { background: #1a1630; border-color: #6b63ff; color: #c0bcff; }
    .start-btn { padding: 16px 48px; background: #6b63ff; color: #fff; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px; }
    .start-btn:hover { background: #7d76ff; transform: translateY(-1px); box-shadow: 0 8px 32px #6b63ff44; }
    .count-badge { display: inline-block; padding: 4px 12px; background: #1a1630; border: 1px solid #2a2a3a; border-radius: 20px; font-size: 12px; color: #6b63ff; font-family: 'Space Mono', monospace; margin-bottom: 32px; }

    /* QUIZ SCREEN */
    .quiz-wrap { width: 100%; max-width: 640px; position: relative; }
    .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .quit-btn { font-size: 11px; color: #555; font-family: 'Space Mono', monospace; letter-spacing: 2px; background: none; border: none; cursor: pointer; text-transform: uppercase; transition: color 0.15s; }
    .quit-btn:hover { color: #f0eee8; }
    .stats-row { display: flex; gap: 16px; }
    .stat { font-family: 'Space Mono', monospace; font-size: 12px; color: #555; }
    .stat span { color: #c0bcff; }
    .streak-badge { padding: 4px 10px; background: #1a1630; border: 1px solid #2a2a3a; border-radius: 20px; font-family: 'Space Mono', monospace; font-size: 11px; color: #6b63ff; }
    .streak-badge.hot { border-color: #ff6b35; color: #ff6b35; background: #1a0d0a; animation: glow 1s ease infinite alternate; }
    @keyframes glow { from { box-shadow: 0 0 4px #ff6b3533; } to { box-shadow: 0 0 12px #ff6b3566; } }

    .progress-bar { width: 100%; height: 3px; background: #1a1a2e; border-radius: 2px; margin-bottom: 28px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #6b63ff, #a78bff); border-radius: 2px; transition: width 0.4s ease; }

    .card { background: #111118; border: 1px solid #1e1e2e; border-radius: 16px; padding: 32px; margin-bottom: 16px; position: relative; overflow: hidden; }
    .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #6b63ff44, transparent); }
    .topic-tag { font-size: 10px; font-family: 'Space Mono', monospace; letter-spacing: 3px; color: #6b63ff; text-transform: uppercase; margin-bottom: 16px; opacity: 0.8; }
    .q-number { font-size: 11px; font-family: 'Space Mono', monospace; color: #333; margin-bottom: 8px; }
    .question { font-size: clamp(16px, 2.5vw, 20px); font-weight: 600; line-height: 1.55; color: #f0eee8; }

    .options { display: flex; flex-direction: column; gap: 10px; }
    .option { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 10px; border: 1px solid #1e1e2e; background: #0d0d14; cursor: pointer; transition: all 0.15s; text-align: left; width: 100%; }
    .option:hover:not(:disabled) { border-color: #3a3a5e; background: #13131e; transform: translateX(2px); }
    .option:disabled { cursor: default; }
    .option.correct { border-color: #22c55e; background: #0d1f14; }
    .option.wrong { border-color: #ef4444; background: #1f0d0d; }
    .option.dimmed { opacity: 0.35; }
    .option-letter { width: 28px; height: 28px; border-radius: 6px; border: 1px solid #2a2a3a; display: flex; align-items: center; justify-content: center; font-family: 'Space Mono', monospace; font-size: 11px; color: #555; flex-shrink: 0; transition: all 0.15s; }
    .option.correct .option-letter { background: #22c55e; border-color: #22c55e; color: #fff; }
    .option.wrong .option-letter { background: #ef4444; border-color: #ef4444; color: #fff; }
    .option-text { font-size: 14px; color: #c8c6c0; line-height: 1.4; }
    .option.correct .option-text, .option.wrong .option-text { color: #f0eee8; }

    .feedback { padding: 12px 18px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
    .feedback.correct { background: #0d1f14; border: 1px solid #22c55e33; color: #4ade80; }
    .feedback.wrong { background: #1f0d0d; border: 1px solid #ef444433; color: #f87171; }
    .feedback-icon { font-size: 18px; }

    .next-btn { width: 100%; padding: 15px; background: #6b63ff; color: #fff; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
    .next-btn:hover { background: #7d76ff; }
    .next-btn.last { background: #1a1630; border: 1px solid #6b63ff; color: #c0bcff; }
    .next-btn.last:hover { background: #6b63ff; color: #fff; }

    @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes pulse-correct { 0%{transform:scale(1)} 50%{transform:scale(1.01)} 100%{transform:scale(1)} }
    .shake { animation: shake 0.45s ease; }
    .pulse-correct { animation: pulse-correct 0.35s ease; }

    /* SUMMARY */
    .summary { max-width: 560px; width: 100%; text-align: center; }
    .summary-ring { width: 140px; height: 140px; margin: 0 auto 28px; position: relative; }
    .summary-ring svg { transform: rotate(-90deg); }
    .ring-bg { fill: none; stroke: #1a1a2e; stroke-width: 10; }
    .ring-fill { fill: none; stroke-width: 10; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
    .ring-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .ring-pct { font-size: 32px; font-weight: 800; font-family: 'Space Mono', monospace; }
    .ring-label { font-size: 10px; color: #555; letter-spacing: 2px; font-family: 'Space Mono', monospace; }
    .summary-title { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .summary-sub { color: #666; font-size: 14px; margin-bottom: 32px; }
    .summary-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 32px; }
    .sum-stat { background: #111118; border: 1px solid #1e1e2e; border-radius: 12px; padding: 16px; }
    .sum-stat-val { font-size: 26px; font-weight: 800; font-family: 'Space Mono', monospace; color: #c0bcff; }
    .sum-stat-lbl { font-size: 11px; color: #555; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Space Mono', monospace; }
    .summary-btns { display: flex; gap: 12px; }
    .summary-btns button { flex: 1; padding: 14px; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
    .btn-retry { background: #6b63ff; color: #fff; border: none; }
    .btn-retry:hover { background: #7d76ff; }
    .btn-menu { background: #111118; border: 1px solid #2a2a3a; color: #888; }
    .btn-menu:hover { border-color: #6b63ff; color: #c0bcff; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.35s ease forwards; }
  `;

  if (mode === "start") {
    const count = topicFilter === "All" ? questions.length : questions.filter(q => q.topic === topicFilter).length;
    return (
      <>
        <style>{styles}</style>
        <div className="noise" />
        <div className="app">
          <div className="start-screen fade-in">
            <div className="logo">SEN201 · NAUB</div>
            <h1 className="start-title">Software Engineering<br />Flashcards</h1>
            <p className="start-sub">Test your knowledge with instant feedback.<br />200 questions covering every lecture topic.</p>
            <div className="topic-label">Filter by topic</div>
            <div className="topic-grid">
              {TOPICS.map(t => (
                <button key={t} className={`topic-btn${topicFilter === t ? " active" : ""}`} onClick={() => setTopicFilter(t)}>{t}</button>
              ))}
            </div>
            <div className="count-badge">{count} question{count !== 1 ? "s" : ""} selected</div>
            <br />
            <button className="start-btn" onClick={startQuiz}>Start Quiz →</button>
          </div>
        </div>
      </>
    );
  }

  if (mode === "summary") {
    const pct = Math.round((score.correct / score.total) * 100);
    const r = 54;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const grade = pct >= 80 ? "Excellent!" : pct >= 60 ? "Good Job!" : pct >= 40 ? "Keep Studying" : "Needs Work";
    const ringColor = pct >= 80 ? "#22c55e" : pct >= 60 ? "#6b63ff" : pct >= 40 ? "#f59e0b" : "#ef4444";
    return (
      <>
        <style>{styles}</style>
        <div className="noise" />
        <div className="app">
          <div className="summary fade-in">
            <div className="summary-ring">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle className="ring-bg" cx="70" cy="70" r={r} />
                <circle className="ring-fill" cx="70" cy="70" r={r} stroke={ringColor} strokeDasharray={circ} strokeDashoffset={offset} />
              </svg>
              <div className="ring-text">
                <div className="ring-pct" style={{ color: ringColor }}>{pct}%</div>
                <div className="ring-label">score</div>
              </div>
            </div>
            <h2 className="summary-title">{grade}</h2>
            <p className="summary-sub">You answered {score.correct} out of {score.total} questions correctly.</p>
            <div className="summary-stats">
              <div className="sum-stat"><div className="sum-stat-val" style={{ color: "#22c55e" }}>{score.correct}</div><div className="sum-stat-lbl">Correct</div></div>
              <div className="sum-stat"><div className="sum-stat-val" style={{ color: "#ef4444" }}>{score.total - score.correct}</div><div className="sum-stat-lbl">Wrong</div></div>
              <div className="sum-stat"><div className="sum-stat-val" style={{ color: "#f59e0b" }}>{bestStreak}</div><div className="sum-stat-lbl">Best Streak</div></div>
            </div>
            <div className="summary-btns">
              <button className="btn-retry" onClick={startQuiz}>Retry Same Topic</button>
              <button className="btn-menu" onClick={() => setMode("start")}>Change Topic</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!current) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="noise" />
      <div className="app">
        <div className="quiz-wrap">
          <div className="topbar">
            <button className="quit-btn" onClick={() => setMode("start")}>← Menu</button>
            <div className="stats-row">
              <div className="stat">✓ <span>{score.correct}</span></div>
              <div className="stat">✗ <span style={{ color: "#f87171" }}>{score.total - score.correct}</span></div>
              <div className={`streak-badge${streak >= 3 ? " hot" : ""}`}>{streak >= 3 ? "🔥" : "⚡"} {streak}</div>
            </div>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>

          <div className={`card${shake ? " shake" : ""}${pulse ? " pulse-correct" : ""}`}>
            <div className="topic-tag">{current.topic}</div>
            <div className="q-number">{idx + 1} / {deck.length}</div>
            <div className="question">{current.q}</div>
          </div>

          {selected !== null && (
            <div className={`feedback ${selected === current.ans ? "correct" : "wrong"} fade-in`}>
              <span className="feedback-icon">{selected === current.ans ? "✓" : "✗"}</span>
              {selected === current.ans ? "Correct! Well done." : `Wrong. The answer is ${LETTERS[current.ans]}: ${current.options[current.ans]}`}
            </div>
          )}

          <div className="options">
            {current.options.map((opt, i) => {
              let cls = "option";
              if (selected !== null) {
                if (i === current.ans) cls += " correct";
                else if (i === selected && selected !== current.ans) cls += " wrong";
                else cls += " dimmed";
              }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={selected !== null}>
                  <span className="option-letter">{LETTERS[i]}</span>
                  <span className="option-text">{opt}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div style={{ marginTop: 14 }}>
              <button className={`next-btn${idx + 1 >= deck.length ? " last" : ""} fade-in`} onClick={next}>
                {idx + 1 >= deck.length ? "See Results →" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}