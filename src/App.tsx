import { useState, useCallback } from "react";
import { ALL_QUESTIONS } from "./lib/data/questions";

interface Question {
  q: string;
  o: string[];
  a: number;
  t: string;
}

const TOPICS = ["All Topics", ...Array.from(new Set(ALL_QUESTIONS.map(q => q.t)))];
const L = ["A", "B", "C", "D"];
const shuffle = (a: any[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
:root{--ink:#0e0c0a;--paper:#f5f0e8;--cream:#ede7d9;--warm:#d4c9b0;--gold:#c8973a;--red:#c0392b;--green:#2d6a4f;--muted:#7a6e5f;--border:#c8b99a;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--paper);color:var(--ink);font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;}
.app{min-height:100vh;display:grid;place-items:center;padding:24px 16px;background:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(200,151,58,.08) 0%,transparent 70%),var(--paper);position:relative;overflow:hidden;}
.app::before{content:'';position:fixed;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(200,151,58,.06) 39px,rgba(200,151,58,.06) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(200,151,58,.04) 39px,rgba(200,151,58,.04) 40px);pointer-events:none;z-index:0;}
.layer{position:relative;z-index:1;width:100%;max-width:680px;}
.stamp{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;}
.stamp-title{font-family:'DM Serif Display',serif;font-size:22px;color:var(--ink);letter-spacing:-.5px;}
.stamp-sub{font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-top:2px;}
.stamp-badge{width:44px;height:44px;border:2px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;font-size:11px;color:var(--gold);text-align:center;line-height:1.2;font-style:italic;}
.eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:20px;}
.hero-h1{font-family:'DM Serif Display',serif;font-size:clamp(44px,8vw,72px);line-height:1.0;color:var(--ink);margin-bottom:8px;letter-spacing:-1px;}
.hero-h1 em{font-style:italic;color:var(--gold);}
.hero-desc{font-size:15px;color:var(--muted);font-weight:300;margin:20px 0 36px;line-height:1.7;max-width:420px;}
.divider{width:60px;height:1px;background:var(--warm);margin:0 0 36px;}
.topic-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:36px;}
.pill{padding:6px 14px;border:1px solid var(--border);border-radius:3px;background:transparent;font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;color:var(--muted);cursor:pointer;transition:all .15s;letter-spacing:.2px;}
.pill:hover{border-color:var(--gold);color:var(--gold);}
.pill.on{background:var(--ink);border-color:var(--ink);color:var(--paper);}
.count-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding:16px 20px;background:var(--cream);border:1px solid var(--border);border-radius:4px;}
.count-num{font-family:'DM Serif Display',serif;font-size:36px;color:var(--ink);line-height:1;}
.count-lbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-top:3px;}
.start-btn{width:100%;padding:18px;background:var(--ink);color:var(--paper);border:none;border-radius:4px;font-family:'Outfit',sans-serif;font-size:16px;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:space-between;padding-left:24px;padding-right:24px;}
.start-btn:hover{background:#1e1a14;transform:translateY(-1px);box-shadow:0 8px 24px rgba(14,12,10,.12);}
.back-btn{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);background:none;border:none;cursor:pointer;transition:color .15s;padding:0;}
.back-btn:hover{color:var(--ink);}
.qmeta{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.qpos{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);}
.score-live{font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);display:flex;align-items:center;gap:14px;}
.sc{color:var(--green);font-weight:500;}
.sw{color:var(--red);font-weight:500;}
.progress-track{height:2px;background:var(--warm);border-radius:1px;margin-bottom:26px;overflow:hidden;}
.progress-thumb{height:100%;background:var(--gold);border-radius:1px;transition:width .5s cubic-bezier(.4,0,.2,1);}
.streak-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border:1px solid var(--border);border-radius:20px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);transition:all .2s;}
.streak-pill.hot{border-color:var(--gold);color:var(--gold);background:rgba(200,151,58,.07);}
.card{background:white;border:1px solid var(--border);border-radius:6px;padding:28px 30px 24px;box-shadow:0 2px 8px rgba(14,12,10,.09),0 0 0 4px rgba(200,151,58,.04);position:relative;margin-bottom:16px;transition:box-shadow .2s;}
.card::after{content:'';position:absolute;inset:0;border-radius:6px;border:1px solid transparent;pointer-events:none;transition:border-color .2s;}
.card.ok::after{border-color:rgba(45,106,79,.3);}
.card.bad::after{border-color:rgba(192,57,43,.3);}
.card-tag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:block;}
.card-q{font-family:'DM Serif Display',serif;font-size:clamp(17px,2.4vw,21px);line-height:1.52;color:var(--ink);font-style:italic;}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
@media(max-width:520px){.opts{grid-template-columns:1fr;}}
.opt{display:flex;align-items:flex-start;gap:11px;padding:13px 15px;background:var(--cream);border:1.5px solid var(--border);border-radius:4px;cursor:pointer;text-align:left;transition:all .15s;width:100%;position:relative;overflow:hidden;}
.opt:hover:not(:disabled){border-color:var(--gold);transform:translateY(-1px);box-shadow:0 3px 10px rgba(14,12,10,.09);}
.opt:disabled{cursor:default;}
.opt.c{background:rgba(45,106,79,.07);border-color:var(--green);}
.opt.w{background:rgba(192,57,43,.07);border-color:var(--red);}
.opt.dim{opacity:.35;}
.opt.hint{background:rgba(45,106,79,.05);border-color:var(--green);opacity:.75;}
.oletter{width:24px;height:24px;flex-shrink:0;border:1.5px solid var(--warm);border-radius:2px;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);margin-top:1px;transition:all .15s;}
.opt.c .oletter{background:var(--green);border-color:var(--green);color:white;}
.opt.w .oletter{background:var(--red);border-color:var(--red);color:white;}
.opt.hint .oletter{border-color:var(--green);color:var(--green);}
.otext{font-size:13px;line-height:1.45;color:var(--ink);font-weight:400;flex:1;}
.opt.dim .otext{color:var(--muted);}
.fb{padding:12px 16px;border-radius:4px;display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;border:1px solid transparent;animation:rise .2s ease forwards;}
.fb.ok{background:rgba(45,106,79,.08);border-color:rgba(45,106,79,.2);color:var(--green);}
.fb.bad{background:rgba(192,57,43,.08);border-color:rgba(192,57,43,.2);color:var(--red);}
.fb-icon{font-size:15px;margin-top:1px;flex-shrink:0;}
.fb-txt{font-size:13px;line-height:1.5;font-weight:500;}
.fb-ans{font-weight:700;}
.next-btn{width:100%;padding:15px 24px;background:var(--ink);color:var(--paper);border:none;border-radius:4px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:space-between;animation:rise .2s ease forwards;}
.next-btn:hover{background:#1e1a14;}
.nb-lbl{opacity:.4;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;}
@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-7px)}30%{transform:translateX(7px)}45%{transform:translateX(-5px)}60%{transform:translateX(5px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}
@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.shk{animation:shake .45s ease;}
.e0{animation:fadeUp .4s .0s ease both;}
.e1{animation:fadeUp .4s .07s ease both;}
.e2{animation:fadeUp .4s .14s ease both;}
.e3{animation:fadeUp .4s .21s ease both;}
.e4{animation:fadeUp .4s .28s ease both;}
.e5{animation:fadeUp .4s .35s ease both;}
.summary{text-align:center;}
.s-eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--muted);margin-bottom:20px;}
.ring-wrap{width:180px;height:180px;position:relative;margin:0 auto 32px;}
.ring-wrap svg{transform:rotate(-90deg);}
.ring-bg{fill:none;stroke:var(--warm);stroke-width:8;}
.ring-fg{fill:none;stroke-width:8;stroke-linecap:round;transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1);}
.ring-inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.ring-pct{font-family:'DM Serif Display',serif;font-size:48px;line-height:1;font-style:italic;}
.ring-lbl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-top:4px;}
.verdict{font-family:'DM Serif Display',serif;font-size:32px;color:var(--ink);margin-bottom:6px;}
.s-note{font-size:14px;color:var(--muted);margin-bottom:36px;line-height:1.6;}
.trio{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:28px;}
.trio-c{padding:20px 12px;background:white;border:1px solid var(--border);border-radius:4px;}
.trio-v{font-family:'DM Serif Display',serif;font-size:36px;line-height:1;font-style:italic;}
.trio-l{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-top:5px;}
.sa{display:flex;gap:10px;}
.bp{flex:1;padding:15px;background:var(--ink);color:var(--paper);border:none;border-radius:4px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .15s;}
.bp:hover{background:#1e1a14;}
.bg{flex:1;padding:15px;background:transparent;color:var(--muted);border:1.5px solid var(--border);border-radius:4px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .15s;}
.bg:hover{border-color:var(--ink);color:var(--ink);}
`;

export default function App() {
  const [topic, setTopic] = useState("All Topics");
  const [deck, setDeck] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState({ c: 0, w: 0 });
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [mode, setMode] = useState("start");

  const buildDeck = useCallback((t: string) => shuffle(t === "All Topics" ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.t === t)), []);

  const begin = () => {
    setDeck(buildDeck(topic)); setIdx(0); setChosen(null);
    setScore({ c: 0, w: 0 }); setStreak(0); setBest(0); setMode("quiz");
  };

  const pick = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    const ok = i === deck[idx].a;
    const ns = ok ? streak + 1 : 0;
    setBest(b => Math.max(b, ns)); setStreak(ns);
    setScore(s => ({ c: s.c + (ok ? 1 : 0), w: s.w + (ok ? 0 : 1) }));
    if (!ok) { setShaking(true); setTimeout(() => setShaking(false), 480); }
  };

  const advance = () => { if (idx + 1 >= deck.length) { setMode("summary"); return; } setIdx(i => i + 1); setChosen(null); };

  const cur = deck[idx];
  const pct = deck.length ? Math.round(((idx + (chosen !== null ? 1 : 0)) / deck.length) * 100) : 0;
  const count = topic === "All Topics" ? ALL_QUESTIONS.length : ALL_QUESTIONS.filter(q => q.t === topic).length;

  // ── SUMMARY ──
  if (mode === "summary") {
    const total = score.c + score.w;
    const p = Math.round((score.c / total) * 100);
    const R = 76, C = 2 * Math.PI * R, off = C - (p / 100) * C;
    const col = p >= 80 ? "#2d6a4f" : p >= 60 ? "#c8973a" : "#c0392b";
    const verdict = p >= 80 ? "Excellent Work" : p >= 60 ? "Good Effort" : p >= 40 ? "Keep Studying" : "Needs Practice";
    return (
      <>
        <style>{S}</style>
        <div className="app"><div className="layer">
          <div className="stamp e0">
            <div><div className="stamp-title">SEN201</div><div className="stamp-sub">NAUB · Software Engineering</div></div>
            <div className="stamp-badge">CBT<br />Prep</div>
          </div>
          <div className="summary">
            <div className="s-eyebrow e1">Session Complete</div>
            <div className="ring-wrap e2">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle className="ring-bg" cx="90" cy="90" r={R} />
                <circle className="ring-fg" cx="90" cy="90" r={R} stroke={col} strokeDasharray={C} strokeDashoffset={off} />
              </svg>
              <div className="ring-inner">
                <div className="ring-pct" style={{ color: col }}>{p}%</div>
                <div className="ring-lbl">score</div>
              </div>
            </div>
            <h2 className="verdict e3">{verdict}</h2>
            <p className="s-note e3">{score.c} of {total} correct · Best streak: {best}</p>
            <div className="trio e4">
              <div className="trio-c"><div className="trio-v" style={{ color: "#2d6a4f" }}>{score.c}</div><div className="trio-l">Correct</div></div>
              <div className="trio-c"><div className="trio-v" style={{ color: "#c0392b" }}>{score.w}</div><div className="trio-l">Wrong</div></div>
              <div className="trio-c"><div className="trio-v" style={{ color: "#c8973a" }}>{best}</div><div className="trio-l">Best Streak</div></div>
            </div>
            <div className="sa e5">
              <button className="bp" onClick={begin}>Retry This Topic</button>
              <button className="bg" onClick={() => setMode("start")}>Change Topic</button>
            </div>
          </div>
        </div></div>
      </>
    );
  }

  // ── QUIZ ──
  if (mode === "quiz" && cur) {
    const isOk = chosen !== null && chosen === cur.a;
    const isBad = chosen !== null && chosen !== cur.a;
    const cls = (i: number) => {
      if (chosen === null) return "opt";
      if (i === cur.a && chosen === cur.a) return "opt c";
      if (i === chosen && chosen !== cur.a) return "opt w";
      if (i === cur.a && chosen !== cur.a) return "opt hint";
      return "opt dim";
    };
    return (
      <>
        <style>{S}</style>
        <div className="app"><div className="layer">
          <div className="stamp">
            <button className="back-btn" onClick={() => setMode("start")}>← Menu</button>
            <div className="score-live">
              <span>✓ <span className="sc">{score.c}</span></span>
              <span>✗ <span className="sw">{score.w}</span></span>
            </div>
          </div>
          <div className="qmeta">
            <div className="qpos">{idx + 1} <span style={{ opacity: .4 }}>/ {deck.length}</span></div>
            <div className={`streak-pill${streak >= 3 ? " hot" : ""}`}>{streak >= 3 ? "🔥" : "◆"} {streak}</div>
          </div>
          <div className="progress-track"><div className="progress-thumb" style={{ width: `${pct}%` }} /></div>

          <div className={`card${shaking ? " shk" : ""}${isOk ? " ok" : ""}${isBad ? " bad" : ""}`}>
            <span className="card-tag">{cur.t}</span>
            <p className="card-q">{cur.q}</p>
          </div>

          {chosen !== null && (
            <div className={`fb ${isOk ? "ok" : "bad"}`}>
              <span className="fb-icon">{isOk ? "✓" : "✗"}</span>
              <span className="fb-txt">
                {isOk ? "Correct!" : <>{`Wrong — the answer is `}<span className="fb-ans">{L[cur.a]}: {cur.o[cur.a]}</span></>}
              </span>
            </div>
          )}

          <div className="opts">
            {cur.o.map((opt: string, i: number) => (
              <button key={i} className={cls(i)} onClick={() => pick(i)} disabled={chosen !== null}>
                <span className="oletter">{L[i]}</span>
                <span className="otext">{opt}</span>
              </button>
            ))}
          </div>

          {chosen !== null && (
            <button className="next-btn" onClick={advance}>
              <span className="nb-lbl">{idx + 1 >= deck.length ? "FINISH" : "NEXT"}</span>
              <span>{idx + 1 >= deck.length ? "See Results" : "Next Question"} →</span>
            </button>
          )}
        </div></div>
      </>
    );
  }

  // ── START ──
  return (
    <>
      <style>{S}</style>
      <div className="app"><div className="layer">
        <div className="stamp e0">
          <div><div className="stamp-title">SEN201</div><div className="stamp-sub">NAUB · Software Engineering</div></div>
          <div className="stamp-badge">CBT<br />Prep</div>
        </div>
        <div className="e1"><div className="eyebrow">Introduction to Software Engineering</div></div>
        <div className="e2">
          <h1 className="hero-h1">Study<br /><em>Flashcards.</em></h1>
          <div className="divider" />
          <p className="hero-desc">200 exam-pattern questions drawn directly from your lecture notes. Instant feedback. Streak tracking. Exam-ready.</p>
        </div>
        <div className="e3">
          <div className="topic-label">Filter by topic</div>
          <div className="pills">
            {TOPICS.map((t: string) => (
              <button key={t} className={`pill${topic === t ? " on" : ""}`} onClick={() => setTopic(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="count-row e4">
          <div><div className="count-num">{count}</div><div className="count-lbl">questions selected</div></div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)", letterSpacing: 2, textTransform: "uppercase" }}>Topic</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 3 }}>{topic}</div>
          </div>
        </div>
        <div className="e5">
          <button className="start-btn" onClick={begin}>
            <span>Begin Session</span>
            <span style={{ opacity: .5, fontSize: 18 }}>→</span>
          </button>
        </div>
      </div></div>
    </>
  );
}