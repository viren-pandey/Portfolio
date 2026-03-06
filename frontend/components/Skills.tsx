// --- Technical Arsenal — Skills.tsx ------------------------------------------
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, PROJECTS } from '../constants';
import { Code2, Brain, Server, Cloud, X, Send, Bot, ExternalLink, Github, ChevronRight } from 'lucide-react';

const FONT = "'Montserrat', sans-serif";
const SLOW  = 'cubic-bezier(0.16,1,0.3,1)'; // slower, springy

// --- Per-card config ----------------------------------------------------------
const CARD_CONFIG = [
  { Icon: Code2,  glow: '#06b6d4', glowBg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.28)',   tagBg: 'rgba(6,182,212,0.12)',   tagBorderColor: '#06b6d4'  },
  { Icon: Brain,  glow: '#8b5cf6', glowBg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.28)',  tagBg: 'rgba(139,92,246,0.12)',  tagBorderColor: '#8b5cf6'  },
  { Icon: Server, glow: '#10b981', glowBg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.28)',  tagBg: 'rgba(16,185,129,0.12)',  tagBorderColor: '#10b981'  },
  { Icon: Cloud,  glow: '#f59e0b', glowBg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.28)',  tagBg: 'rgba(245,158,11,0.12)',  tagBorderColor: '#f59e0b'  },
] as const;

// --- Particles ----------------------------------------------------------------
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${((i * 4.73 + 3) % 96).toFixed(1)}%`,
  top:  `${((i * 7.19 + 5) % 88).toFixed(1)}%`,
  size: i % 2 === 0 ? 1.5 : 2.5,
  delay: (i * 0.38) % 3,
  duration: 2.4 + (i * 0.27) % 2.6,
}));

// --- Per-category context for the AI chat -------------------------------------
const CATEGORY_CONTEXT: Record<string, string> = {
  "Core Technologies": `Viren uses TypeScript, JavaScript, Python, Java, MERN Stack, and C/C++ as core languages. He built SmartCrowd (real-time crowd monitoring) with a React.js + TypeScript frontend and DualityAI (space safety detection) using Python throughout the ML pipeline. His go-to stack for full-stack apps is MERN + Python backends.`,
  "ML Frameworks": `Viren has hands-on expertise with YOLOv8, PyTorch, OpenCV, TensorFlow, Pandas and NumPy. In SmartCrowd he deployed YOLOv8 for real-time person detection from live webcam streams. In DualityAI he trained a custom YOLOv8 model on the DualityAI Falcon dataset to detect 7 safety-critical objects (Oxygen Tank, Fire Alarm, etc.) achieving high accuracy.`,
  "Web & Backend": `Viren builds production backends with FastAPI and Node.js. In SmartCrowd he engineered RESTful API endpoints for live video streaming and crowd statistics using FastAPI. For frontends he uses React.js + TailwindCSS. In DualityAI he deployed a Streamlit app for real-time image uploads and model inference, end-to-end.`,
  "Tools & Clouds": `Viren holds Oracle Cloud Infrastructure AI Foundations certification and Google Cloud (Prepare Data for ML APIs) badge. He actively uses Git + GitHub for version control with clean commit workflows, VS Code as primary IDE, and has deployed workloads on both GCP and Oracle Cloud. He containerises projects with Docker where applicable.`,
};

// --- Project-to-category relevance -------------------------------------------
const ML_TAGS  = new Set(["YOLOv8","PyTorch","OpenCV","TensorFlow","Pandas","NumPy","Streamlit"]);
const WEB_TAGS = new Set(["FastAPI","React.js","Streamlit","REST APIs","Node.js","TailwindCSS","Vite"]);

function getProjectsForCategory(category: string) {
  if (category === "ML Frameworks")  return PROJECTS.filter(p => p.tags.some(t => ML_TAGS.has(t)));
  if (category === "Web & Backend")  return PROJECTS.filter(p => p.tags.some(t => WEB_TAGS.has(t)));
  return PROJECTS; // Core Technologies & Tools show all
}

// --- Mini chat response generator --------------------------------------------
function genResponse(query: string, category: string): string {
  const q    = query.toLowerCase();
  const ctx  = CATEGORY_CONTEXT[category] ?? '';
  const proj = getProjectsForCategory(category);

  if (q.match(/what|built|project|made|work|did/)) {
    const list = proj.map(p => `• ${p.title} — ${p.description}`).join('\n');
    return `In the ${category} domain, Viren has built:\n\n${list}\n\n${ctx}`;
  }
  if (q.match(/tech|stack|tool|language|framework|use/)) {
    return `For ${category}, Viren uses: ${SKILLS.find(s => s.category === category)?.skills.join(', ')}.\n\n${ctx}`;
  }
  if (q.match(/achiev|result|impact|outcome|highlight/)) {
    const points = proj.flatMap(p => p.points).map(pt => `• ${pt}`).join('\n');
    return `Key achievements in this area:\n\n${points}`;
  }
  if (q.match(/how|explain|detail|describ/)) {
    return ctx;
  }
  if (q.match(/hello|hi|hey/)) {
    return `Hey! Ask me anything about Viren's ${category} work — projects, technologies, achievements, or how things were built!`;
  }
  return `Great question! Here's what I know about Viren's ${category} expertise:\n\n${ctx}\n\nFeel free to ask anything more specific!`;
}

// --- Skill Tag ----------------------------------------------------------------
const SkillTag: React.FC<{ skill: string; tagBg: string; tagBorderColor: string; lit?: boolean }> = ({ skill, tagBg, tagBorderColor, lit }) => {
  const [hov, setHov] = React.useState(false);
  const active = hov || lit;
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-block', padding: '4px 12px', fontFamily: FONT,
        fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em',
        color: active ? '#f1f5f9' : '#94a3b8',
        background: active ? tagBg : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeftWidth: '2.5px', borderLeftColor: tagBorderColor,
        borderRadius: '0 8px 8px 0',
        transform: hov ? 'scale(1.07)' : 'scale(1)',
        boxShadow: active ? `0 0 10px ${tagBorderColor}44` : 'none',
        transition: 'all 0.22s ease',
        cursor: 'default', whiteSpace: 'nowrap',
      }}
    >{skill}</span>
  );
};

// --- Mini Chat (inside detail panel) -----------------------------------------
interface ChatMsg { role: 'user' | 'bot'; text: string }

const QUICK_QS = [
  'What did you build here?',
  'Which technologies were used?',
  'What were the key achievements?',
  'How does this work technically?',
];

const MiniChat: React.FC<{ category: string; glow: string }> = ({ category, glow }) => {
  const [msgs, setMsgs] = React.useState<ChatMsg[]>([
    { role: 'bot', text: `Hey! I'm Viren's assistant. Ask me about his **${category}** work — projects, tech choices, or results! ??` },
  ]);
  const [input, setInput]     = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef             = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 420));
    const reply = genResponse(text, category);
    setMsgs(prev => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Chat header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${glow}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 14px ${glow}44`, flexShrink: 0 }}>
          <Bot size={18} style={{ color: glow }} />
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', fontFamily: FONT }}>Viren's AI Assistant</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.65rem', fontFamily: FONT, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', scrollbarWidth: 'thin', scrollbarColor: `${glow}33 transparent` }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '86%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? `linear-gradient(135deg,${glow}cc,${glow}88)` : 'rgba(255,255,255,0.06)',
              color: '#e2e8f0', fontSize: '0.78rem', fontFamily: FONT, lineHeight: 1.6, fontWeight: 500,
              border: m.role === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
              whiteSpace: 'pre-wrap',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 6, padding: '10px 14px', width: 70, background: 'rgba(255,255,255,0.06)', borderRadius: '18px 18px 18px 4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: glow, animation: `bounce 0.9s ${i * 0.15}s ease-in-out infinite` }} />)}
          </div>
        )}
      </div>

      {/* Quick question chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {QUICK_QS.map((q, i) => (
          <button key={i} onClick={() => send(q)}
            style={{ padding: '5px 11px', borderRadius: '999px', border: `1px solid ${glow}44`, background: `${glow}12`, color: glow, fontSize: '0.68rem', fontFamily: FONT, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s ease', letterSpacing: '0.02em' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = `${glow}28`; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = `${glow}12`; }}
          >{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 6px 6px 14px', alignItems: 'center' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder={`Ask about ${category}...`}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '0.78rem', fontFamily: FONT, fontWeight: 500 }}
        />
        <button onClick={() => send(input)}
          style={{ width: 34, height: 34, borderRadius: '12px', background: `linear-gradient(135deg,${glow},${glow}99)`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 12px ${glow}55` }}>
          <Send size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
};

// --- Expanded Detail Panel ----------------------------------------------------
const DetailPanel: React.FC<{
  category: string;
  cfg: typeof CARD_CONFIG[number];
  onClose: () => void;
}> = ({ category, cfg, onClose }) => {
  const projects = getProjectsForCategory(category);
  const { glow, glowBg, border } = cfg;

  return (
    <motion.div
      key={category}
      initial={{ opacity: 0, y: -16, scaleY: 0.94 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -10, scaleY: 0.96 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{
        originY: 0,
        marginTop: '24px',
        borderRadius: '28px',
        background: 'rgba(8,6,26,0.82)',
        backdropFilter: 'blur(26px)',
        WebkitBackdropFilter: 'blur(26px)',
        border: `1px solid ${border}`,
        boxShadow: `0 0 40px ${glow}28, 0 24px 60px rgba(0,0,0,0.5), inset 0 0 40px ${glow}06`,
        overflow: 'hidden',
      }}
    >
      {/* Scanline */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.01) 2px,rgba(255,255,255,0.01) 4px)', pointerEvents: 'none', borderRadius: '28px' }} />

      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px', borderBottom: `1px solid ${border}`,
        background: `linear-gradient(90deg,${glow}12,transparent)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '14px', background: glowBg, boxShadow: `0 0 18px ${glow}55` }}>
            <cfg.Icon size={22} style={{ color: glow }} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', fontFamily: FONT, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: glow, marginBottom: '3px' }}>
              {category} · Related Work
            </div>
            <div style={{ fontSize: '1rem', fontFamily: FONT, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
              Projects & Achievements
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#f1f5f9'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}>
          <X size={16} />
        </button>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '0', minHeight: '420px' }}>

        {/* Left: Projects */}
        <div style={{ padding: '26px', borderRight: `1px solid ${border}`, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {projects.length === 0
            ? <div style={{ color: '#64748b', fontFamily: FONT, fontSize: '0.85rem' }}>No specific projects for this category yet.</div>
            : projects.map((proj, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.07)`, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${glow},transparent)`, borderRadius: '20px 20px 0 0' }} />

                {/* Project title + links */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f1f5f9', fontFamily: FONT, marginBottom: '4px' }}>{proj.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: FONT, fontWeight: 500 }}>{proj.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer"
                        style={{ width: 32, height: 32, borderRadius: '10px', background: `${glow}18`, border: `1px solid ${glow}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: glow, textDecoration: 'none', transition: 'all 0.18s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${glow}30`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${glow}18`; }}>
                        <Github size={14} />
                      </a>
                    )}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer"
                        style={{ width: 32, height: 32, borderRadius: '10px', background: `${glow}18`, border: `1px solid ${glow}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: glow, textDecoration: 'none', transition: 'all 0.18s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${glow}30`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${glow}18`; }}>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Points */}
                <ul style={{ margin: '12px 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {proj.points.map((pt, pi) => (
                    <li key={pi} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.76rem', color: '#94a3b8', fontFamily: FONT, fontWeight: 500, lineHeight: 1.55 }}>
                      <ChevronRight size={12} style={{ color: glow, flexShrink: 0, marginTop: '3px' }} />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {proj.tags.map((tag, ti) => (
                    <span key={ti} style={{ padding: '3px 10px', borderRadius: '999px', background: `${glow}16`, border: `1px solid ${glow}40`, color: glow, fontSize: '0.67rem', fontFamily: FONT, fontWeight: 700, letterSpacing: '0.05em' }}>{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))
          }
        </div>

        {/* Right: Mini Chat */}
        <div style={{ padding: '26px', display: 'flex', flexDirection: 'column' }}>
          <MiniChat category={category} glow={glow} />
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component -----------------------------------------------------------
const Skills: React.FC = () => {
  const [hoveredIdx,  setHoveredIdx]  = React.useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const handleClick = (idx: number) => {
    setSelectedIdx(prev => prev === idx ? null : idx);
  };

  return (
    <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 24px', fontFamily: FONT }}>

      {/* bounce keyframe injection */}
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:scale(0);opacity:0.3} 40%{transform:scale(1);opacity:1} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '600px', background: 'radial-gradient(ellipse at center,rgba(88,28,135,0.2) 0%,rgba(49,10,101,0.09) 45%,transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {PARTICLES.map(p => (
          <motion.div key={p.id}
            style={{ position: 'absolute', left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: '50%', background: p.id % 3 === 0 ? 'rgba(6,182,212,0.55)' : 'rgba(139,92,246,0.55)' }}
            animate={{ opacity: [0.08, 0.7, 0.08], scale: [0.7, 1.3, 0.7] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* -- Heading -- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px', position: 'relative' }}>
        <motion.h2
          initial={{ opacity: 0, y: -18 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} viewport={{ once: true }}
          style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '18px', fontFamily: FONT, background: 'linear-gradient(130deg,#e2e8f0 25%,#a78bfa 65%,#38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Technical Arsenal
        </motion.h2>
        <div style={{ position: 'relative', height: '4px', width: '180px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <motion.div initial={{ x: '-100%' }} whileInView={{ x: '0%' }} transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#8b5cf6,#06b6d4)', borderRadius: '999px', boxShadow: '0 0 14px #8b5cf688' }} />
        </div>
        <p style={{ marginTop: '14px', fontSize: '0.82rem', color: '#64748b', fontFamily: FONT, fontWeight: 500, letterSpacing: '0.02em' }}>
          Click any card to explore related projects &amp; ask the AI assistant
        </p>
      </div>

      {/* -- Desktop: hover-expand + click-to-select flex row (lg+) -- */}
      <div className="hidden lg:flex" style={{ gap: '20px', alignItems: 'stretch' }}>
        {SKILLS.map((cat, idx) => {
          const cfg         = CARD_CONFIG[idx % CARD_CONFIG.length];
          const isSelected  = selectedIdx === idx;
          const isHovered   = hoveredIdx === idx;
          const isCollapsed = hoveredIdx !== null && selectedIdx === null && idx === hoveredIdx + 1;
          const active      = isHovered || isSelected;

          return (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: idx * 0.13 }} viewport={{ once: true, margin: '-40px' }}
              style={{
                flex: isCollapsed ? 0 : (isHovered && selectedIdx === null) ? 2 : isSelected ? 2 : 1,
                minWidth: 0,
                transition: `flex 0.8s ${SLOW}`,
              }}
            >
              <div
                onClick={() => handleClick(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  height: '100%', padding: isCollapsed ? '28px 0' : '28px', opacity: isCollapsed ? 0 : 1,
                  overflow: 'hidden', position: 'relative', borderRadius: '24px',
                  background: isSelected ? `linear-gradient(145deg,rgba(8,6,26,0.9),${cfg.glow}10)` : 'rgba(8,6,24,0.68)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${active ? cfg.glow : cfg.border}`,
                  boxShadow: isSelected
                    ? `0 0 40px ${cfg.glow}55, 0 0 90px ${cfg.glow}22, inset 0 0 40px ${cfg.glow}10`
                    : isHovered
                      ? `0 0 22px ${cfg.glow}44, 0 0 55px ${cfg.glow}18`
                      : '0 2px 22px rgba(0,0,0,0.32)',
                  cursor: 'pointer',
                  transition: `padding 0.8s ${SLOW}, opacity 0.5s ease, border-color 0.4s ease, box-shadow 0.4s ease, border-radius 0.4s ease, background 0.4s ease`,
                }}
              >
                {/* Scanline */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 4px)', pointerEvents: 'none' }} />

                {/* Selected ring pulse */}
                {isSelected && (
                  <div style={{ position: 'absolute', inset: -1, borderRadius: '25px', border: `1px solid ${cfg.glow}`, animation: 'pulse 2s ease-in-out infinite', pointerEvents: 'none' }} />
                )}

                {/* Icon */}
                <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '18px', background: cfg.glowBg, marginBottom: '20px', boxShadow: `0 0 22px ${cfg.glow}55`, transform: active ? 'scale(1.12)' : 'scale(1)', transition: `transform 0.5s ${SLOW}` }}>
                  <cfg.Icon size={26} style={{ color: cfg.glow }} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: '#e2e8f0', letterSpacing: '0.1em', fontFamily: FONT, textTransform: 'uppercase' }}>
                  {cat.category}
                </h3>

                {/* Click hint */}
                <div style={{ fontSize: '0.67rem', fontFamily: FONT, fontWeight: 600, color: isSelected ? cfg.glow : '#475569', letterSpacing: '0.08em', marginBottom: '14px', textTransform: 'uppercase', transition: 'color 0.3s ease' }}>
                  {isSelected ? '? Expanded' : '? Click to explore'}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {cat.skills.map((skill, sIdx) => (
                    <SkillTag key={sIdx} skill={skill} tagBg={cfg.tagBg} tagBorderColor={cfg.tagBorderColor} lit={active} />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* -- Detail Panel (click-expanded, desktop) -- */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <DetailPanel
            key={selectedIdx}
            category={SKILLS[selectedIdx].category}
            cfg={CARD_CONFIG[selectedIdx % CARD_CONFIG.length]}
            onClose={() => setSelectedIdx(null)}
          />
        )}
      </AnimatePresence>

      {/* -- Mobile: 2-col accordion grid -- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:hidden">
        {SKILLS.map((cat, idx) => {
          const cfg        = CARD_CONFIG[idx % CARD_CONFIG.length];
          const isSel      = selectedIdx === idx;
          return (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }} viewport={{ once: true }}>
              {/* Card */}
              <div onClick={() => handleClick(idx)}
                style={{
                  padding: '24px', borderRadius: '22px',
                  background: isSel ? `linear-gradient(145deg,rgba(8,6,26,0.9),${cfg.glow}10)` : 'rgba(8,6,24,0.68)',
                  backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                  border: `1px solid ${isSel ? cfg.glow : cfg.border}`,
                  position: 'relative', overflow: 'hidden', cursor: 'pointer',
                  boxShadow: isSel ? `0 0 32px ${cfg.glow}44` : '0 2px 16px rgba(0,0,0,0.3)',
                  transition: 'all 0.5s ease',
                }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 4px)', pointerEvents: 'none' }} />
                <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '14px', background: cfg.glowBg, marginBottom: '16px', boxShadow: `0 0 16px ${cfg.glow}44`, transform: isSel ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.4s ease' }}>
                  <cfg.Icon size={22} style={{ color: cfg.glow }} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '5px', color: '#e2e8f0', fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat.category}</h3>
                <div style={{ fontSize: '0.65rem', fontFamily: FONT, fontWeight: 600, color: isSel ? cfg.glow : '#475569', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
                  {isSel ? '? Collapse' : '? Tap to explore'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {cat.skills.map((skill, sIdx) => <SkillTag key={sIdx} skill={skill} tagBg={cfg.tagBg} tagBorderColor={cfg.tagBorderColor} lit={isSel} />)}
                </div>
              </div>

              {/* Mobile detail panel */}
              <AnimatePresence>
                {isSel && (
                  <motion.div
                    key="mobile-detail"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden', marginTop: '12px' }}
                  >
                    <div style={{ padding: '20px', borderRadius: '22px', background: 'rgba(8,6,26,0.82)', backdropFilter: 'blur(20px)', border: `1px solid ${cfg.border}`, boxShadow: `0 0 24px ${cfg.glow}28` }}>
                      {/* Projects */}
                      {getProjectsForCategory(cat.category).map((proj, pi) => (
                        <div key={pi} style={{ marginBottom: pi < getProjectsForCategory(cat.category).length - 1 ? '16px' : 0, padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${cfg.glow},transparent)` }} />
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f1f5f9', fontFamily: FONT, marginBottom: '4px' }}>{proj.title}</div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontFamily: FONT, marginBottom: '10px' }}>{proj.description}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {proj.tags.map((tag, ti) => <span key={ti} style={{ padding: '2px 9px', borderRadius: '999px', background: `${cfg.glow}16`, border: `1px solid ${cfg.glow}40`, color: cfg.glow, fontSize: '0.65rem', fontFamily: FONT, fontWeight: 700 }}>{tag}</span>)}
                          </div>
                        </div>
                      ))}
                      {/* Mini chat on mobile */}
                      <div style={{ marginTop: '16px', height: '320px' }}>
                        <MiniChat category={cat.category} glow={cfg.glow} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
