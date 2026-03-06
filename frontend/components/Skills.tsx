// --- Technical Arsenal · Skills.tsx ------------------------------------------
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, PROJECTS } from '../constants';
import { Code2, Brain, Server, Cloud, X, Send, Bot, ExternalLink, Github, ChevronRight } from 'lucide-react';

const FONT = "'Montserrat', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const CARD_CONFIG = [
  { Icon: Code2,  accent: '#06b6d4' },
  { Icon: Brain,  accent: '#8b5cf6' },
  { Icon: Server, accent: '#10b981' },
  { Icon: Cloud,  accent: '#f59e0b' },
];

const CATEGORY_CONTEXT = {
  "Core Technologies": "Viren uses TypeScript, JavaScript, Python, Java, MERN Stack, and C/C++ as core languages. He built SmartCrowd (real-time crowd monitoring) with a React.js + TypeScript frontend and DualityAI (space safety detection) using Python throughout the ML pipeline. His go-to stack for full-stack apps is MERN + Python backends.",
  "ML Frameworks": "Viren has hands-on expertise with YOLOv8, PyTorch, OpenCV, TensorFlow, Pandas and NumPy. In SmartCrowd he deployed YOLOv8 for real-time person detection from live webcam streams. In DualityAI he trained a custom YOLOv8 model on the DualityAI Falcon dataset to detect 7 safety-critical objects achieving high accuracy.",
  "Web & Backend": "Viren builds production backends with FastAPI and Node.js. In SmartCrowd he engineered RESTful API endpoints for live video streaming and crowd statistics using FastAPI. For frontends he uses React.js + TailwindCSS. In DualityAI he deployed a Streamlit app for real-time image uploads and model inference, end-to-end.",
  "Tools & Clouds": "Viren holds Oracle Cloud Infrastructure AI Foundations certification and Google Cloud (Prepare Data for ML APIs) badge. He actively uses Git + GitHub for version control, VS Code as primary IDE, and has deployed workloads on both GCP and Oracle Cloud.",
};

function getProjectsForCategory(category) {
  const cat = SKILLS.find(s => s.category === category);
  if (!cat) return [];
  const skillSet = new Set(cat.skills.map(s => s.toLowerCase()));
  return PROJECTS.filter(p => p.tags.some(t => skillSet.has(t.toLowerCase())));
}

function genResponse(query, category) {
  const q    = query.toLowerCase();
  const ctx  = CATEGORY_CONTEXT[category] || '';
  const proj = getProjectsForCategory(category);
  if (q.match(/what|built|project|made|work|did/)) {
    if (proj.length === 0) return 'No dedicated project for ' + category + ' yet, but here is what Viren has learned and worked with in this area:\n\n' + ctx;
    const list = proj.map(p => `\u2022 ${p.title} \u2014 ${p.description}`).join('\n');
    return `In the ${category} domain, Viren has built:\n\n${list}\n\n${ctx}`;
  }
  if (q.match(/tech|stack|tool|language|framework|use/)) {
    const skills = SKILLS.find(s => s.category === category);
    return `For ${category}, Viren uses: ${skills ? skills.skills.join(', ') : 'various tools'}.\n\n${ctx}`;
  }
  if (q.match(/achiev|result|impact|outcome|key/)) {
    const points = proj.flatMap(p => p.points).map(pt => `\u2022 ${pt}`).join('\n');
    return `Key achievements in this area:\n\n${points}`;
  }
  if (q.match(/how|explain|detail|describ/)) return ctx;
  if (q.match(/hello|hi|hey/)) return `Hey! Ask me anything about Viren's ${category} work!`;
  return `Great question! Here is what I know about Viren's ${category} expertise:\n\n${ctx}\n\nFeel free to ask anything more specific!`;
}

const SkillTag = ({ skill, accent }) => (
  React.createElement('span', {
    className: 'inline-block text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200',
    style: { fontFamily: FONT, background: accent + '18', border: '1px solid ' + accent + '45', color: accent }
  }, skill)
);

const GROQ_KEY = typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_GROQ_API_KEY || '') : '';

const QUICK_QS = ['What did you build here?', 'Technologies used?', 'Key achievements?', 'How does this work?'];

const MiniChat = ({ category, accent }) => {
  const [msgs, setMsgs]       = React.useState([{ role: 'bot', text: `Hi! Ask me about Viren's ${category} work. I'm powered by Groq AI!` }]);
  const [input, setInput]     = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef             = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const history = msgs; // capture before state update
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      if (!GROQ_KEY || GROQ_KEY === 'your_groq_api_key_here') throw new Error('no-key');
      const catSkills = SKILLS.find(s => s.category === category);
      const projList  = getProjectsForCategory(category)
        .map(p => `${p.title}: ${p.description}. Stack: ${p.tags.join(', ')}.`)
        .join('\n');
      const sysPrompt =
        `You are an AI assistant embedded in Viren Pandey's portfolio website. ` +
        `Answer visitor questions about his ${category} skills concisely and accurately.\n\n` +
        `Skills in this category: ${catSkills ? catSkills.skills.join(', ') : 'various'}\n\n` +
        `Background: ${CATEGORY_CONTEXT[category] || ''}\n\n` +
        (projList ? `Related projects:\n${projList}` : `No dedicated projects yet for this category. Focus on what was learned.`) +
        `\n\nKeep replies friendly and under 4 sentences unless the user asks for detail. Use plain text, no markdown.`;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: sysPrompt },
            ...history.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: text },
          ],
          max_tokens: 350,
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error('api-error');
      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not get a response.';
      setMsgs(prev => [...prev, { role: 'bot', text: reply }]);
    } catch {
      // fallback to local rule-based response
      setMsgs(prev => [...prev, { role: 'bot', text: genResponse(text, category) }]);
    }
    setLoading(false);
  };

  return (
    React.createElement('div', { className: 'flex flex-col h-full gap-3', style: { fontFamily: FONT } },
      React.createElement('div', { className: 'flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-white/10' },
        React.createElement('div', { className: 'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', style: { background: accent + '20' } },
          React.createElement(Bot, { size: 17, style: { color: accent } })
        ),
        React.createElement('div', null,
          React.createElement('div', { className: 'text-sm font-bold text-gray-800 dark:text-gray-100' }, "Viren's AI Assistant"),
          React.createElement('div', { className: 'flex items-center gap-1.5' },
            React.createElement('div', { className: 'w-1.5 h-1.5 rounded-full bg-emerald-500', style: { animation: 'pulse 2s infinite' } }),
            React.createElement('span', { className: 'text-[10px] font-semibold uppercase tracking-widest text-gray-400' }, 'Online')
          )
        )
      ),
      React.createElement('div', { ref: scrollRef, className: 'flex-1 overflow-y-auto flex flex-col gap-2 min-h-0', style: { scrollbarWidth: 'thin' } },
        msgs.map((m, i) =>
          React.createElement('div', { key: i, className: 'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start') },
            React.createElement('div', {
              className: 'max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed font-medium ' + (m.role === 'bot' ? 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10' : 'text-white'),
              style: { fontFamily: FONT, borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.role === 'user' ? accent : undefined, whiteSpace: 'pre-wrap' }
            }, m.text)
          )
        ),
        loading && React.createElement('div', { className: 'flex gap-1.5 px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10 w-[68px]' },
          [0,1,2].map(i => React.createElement('div', { key: i, style: { width: 6, height: 6, borderRadius: '50%', background: accent, animation: `bounce 0.9s ${i * 0.15}s ease-in-out infinite` } }))
        )
      ),
      React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
        QUICK_QS.map((q, i) =>
          React.createElement('button', {
            key: i, onClick: () => send(q),
            className: 'px-2.5 py-1 rounded-full text-[11px] font-semibold transition-opacity hover:opacity-70',
            style: { background: accent + '15', border: '1px solid ' + accent + '40', color: accent, fontFamily: FONT }
          }, q)
        )
      ),
      React.createElement('div', { className: 'flex gap-2 bg-gray-100 dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-2 items-center' },
        React.createElement('input', {
          value: input,
          onChange: e => setInput(e.target.value),
          onKeyDown: e => e.key === 'Enter' && !e.shiftKey && send(input),
          placeholder: 'Ask about ' + category + '...',
          className: 'flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400',
          style: { fontFamily: FONT }
        }),
        React.createElement('button', {
          onClick: () => send(input),
          className: 'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
          style: { background: accent }
        },
          React.createElement(Send, { size: 14, color: '#fff' })
        )
      )
    )
  );
};

const DetailPanel = ({ category, cfg, onClose }) => {
  const projects = getProjectsForCategory(category);
  const { accent } = cfg;
  return (
    React.createElement(motion.div, {
      key: category,
      initial: { opacity: 0, y: -14, scaleY: 0.95 },
      animate: { opacity: 1, y: 0, scaleY: 1 },
      exit: { opacity: 0, y: -8, scaleY: 0.97 },
      transition: { duration: 0.75, ease: EASE },
      className: 'mt-5 rounded-3xl bg-white dark:bg-[#0d0b22] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden',
      style: { originY: 0 }
    },
      React.createElement('div', { className: 'h-0.5 w-full', style: { background: 'linear-gradient(90deg,' + accent + ',transparent)' } }),
      React.createElement('div', { className: 'flex items-center justify-between px-7 py-5 border-b border-gray-100 dark:border-white/8' },
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('div', { className: 'p-2.5 rounded-xl', style: { background: accent + '18' } },
            React.createElement(cfg.Icon, { size: 20, style: { color: accent }, strokeWidth: 1.5 })
          ),
          React.createElement('div', null,
            React.createElement('div', { className: 'text-[10px] font-bold uppercase tracking-widest mb-0.5', style: { color: accent, fontFamily: FONT } }, category),
            React.createElement('div', { className: 'text-base font-bold text-gray-900 dark:text-white', style: { fontFamily: FONT } }, projects.length > 0 ? 'Projects & Achievements' : 'What I Learned')
          )
        ),
        React.createElement('button', {
          onClick: onClose,
          className: 'w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/15 transition-all'
        }, React.createElement(X, { size: 15 }))
      ),
      projects.length === 0
        ? React.createElement('div', { className: 'p-6 flex flex-col', style: { minHeight: 440 } },
            React.createElement(MiniChat, { category: category, accent: accent })
          )
        : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 360px' } },
        React.createElement('div', { className: 'p-6 border-r border-gray-100 dark:border-white/8 flex flex-col gap-4 overflow-y-auto max-h-[480px]' },
          projects.map((proj, i) =>
                React.createElement(motion.div, {
                  key: i,
                  initial: { opacity: 0, x: -12 },
                  animate: { opacity: 1, x: 0 },
                  transition: { duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE },
                  className: 'p-5 rounded-2xl bg-gray-50 dark:bg-white/4 border border-gray-200/80 dark:border-white/8 relative overflow-hidden'
                },
                  React.createElement('div', { className: 'absolute top-0 left-0 right-0 h-px', style: { background: 'linear-gradient(90deg,' + accent + ',transparent)' } }),
                  React.createElement('div', { className: 'flex items-start justify-between gap-3 mb-2' },
                    React.createElement('div', null,
                      React.createElement('div', { className: 'text-base font-bold text-gray-900 dark:text-white mb-1', style: { fontFamily: FONT } }, proj.title),
                      React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400', style: { fontFamily: FONT } }, proj.description)
                    ),
                    React.createElement('div', { className: 'flex gap-2 flex-shrink-0' },
                      proj.github && React.createElement('a', { href: proj.github, target: '_blank', rel: 'noreferrer', className: 'w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-75 transition-opacity', style: { background: accent + '15', border: '1px solid ' + accent + '40', color: accent } }, React.createElement(Github, { size: 13 })),
                      proj.link && React.createElement('a', { href: proj.link, target: '_blank', rel: 'noreferrer', className: 'w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-75 transition-opacity', style: { background: accent + '15', border: '1px solid ' + accent + '40', color: accent } }, React.createElement(ExternalLink, { size: 13 }))
                    )
                  ),
                  React.createElement('ul', { className: 'mt-3 flex flex-col gap-1.5' },
                    proj.points.map((pt, pi) =>
                      React.createElement('li', { key: pi, className: 'flex gap-2 items-start text-xs text-gray-500 dark:text-gray-400', style: { fontFamily: FONT, lineHeight: 1.6 } },
                        React.createElement(ChevronRight, { size: 11, style: { color: accent, flexShrink: 0, marginTop: 3 } }),
                        pt
                      )
                    )
                  ),
                  React.createElement('div', { className: 'flex flex-wrap gap-1.5 mt-3' },
                    proj.tags.map((tag, ti) =>
                      React.createElement('span', { key: ti, className: 'text-[10px] font-bold px-2.5 py-0.5 rounded-full', style: { fontFamily: FONT, background: accent + '15', border: '1px solid ' + accent + '40', color: accent } }, tag)
                    )
                  )
                )
              )
        ),
        React.createElement('div', { className: 'p-6 flex flex-col max-h-[480px]' },
          React.createElement(MiniChat, { category: category, accent: accent })
        )
      )
    )
  );
};

const Skills = () => {
  const [hoveredIdx,  setHoveredIdx]  = React.useState(null);
  const [selectedIdx, setSelectedIdx] = React.useState(null);
  const handleClick = (idx) => setSelectedIdx(prev => prev === idx ? null : idx);

  return (
    React.createElement('div', { className: 'relative max-w-6xl mx-auto px-6', style: { fontFamily: FONT } },
      React.createElement('style', null, '@keyframes bounce{0%,80%,100%{transform:scale(0);opacity:0.3}40%{transform:scale(1);opacity:1}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}'),

      React.createElement('div', { className: 'flex flex-col items-center mb-14' },
        React.createElement(motion.h2, {
          initial: { opacity: 0, y: -16 }, whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.7 }, viewport: { once: true },
          className: 'text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight',
          style: { fontFamily: FONT }
        }, 'Technical Arsenal'),
        React.createElement('div', { className: 'h-0.5 w-24 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400' }),
        React.createElement('p', { className: 'mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium', style: { fontFamily: FONT } }, 'Click any card to explore projects & ask the AI assistant')
      ),

      React.createElement('div', { className: 'hidden lg:flex gap-4 items-stretch' },
        SKILLS.map((cat, idx) => {
          const cfg         = CARD_CONFIG[idx % CARD_CONFIG.length];
          const isSelected  = selectedIdx === idx;
          const isHovered   = hoveredIdx === idx;
          const isCollapsed = hoveredIdx !== null && selectedIdx === null && idx === hoveredIdx + 1;
          const active      = isHovered || isSelected;
          return (
            React.createElement(motion.div, {
              key: idx,
              initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.65, delay: idx * 0.1 }, viewport: { once: true, margin: '-40px' },
              style: {
                flex: isCollapsed ? 0 : ((isHovered && selectedIdx === null) || isSelected) ? 2 : 1,
                minWidth: 0,
                transition: 'flex 0.75s cubic-bezier(0.16,1,0.3,1)',
              }
            },
              React.createElement('div', {
                onClick: () => handleClick(idx),
                onMouseEnter: () => setHoveredIdx(idx),
                onMouseLeave: () => setHoveredIdx(null),
                className: [
                  'h-full rounded-2xl border cursor-pointer relative overflow-hidden',
                  'bg-white dark:bg-gray-900/60',
                  isSelected ? 'shadow-lg' : 'border-gray-200 dark:border-white/10 hover:shadow-md',
                  isCollapsed ? 'opacity-0 px-0' : 'opacity-100 p-6',
                ].join(' '),
                style: {
                  borderColor: active ? cfg.accent : undefined,
                  boxShadow: isSelected ? '0 0 0 1.5px ' + cfg.accent + '60, 0 8px 32px ' + cfg.accent + '18' : undefined,
                  transition: 'all 0.3s ease, padding 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
                }
              },
                isSelected && React.createElement('div', { className: 'absolute top-0 left-0 right-0 h-0.5', style: { background: cfg.accent } }),
                React.createElement('div', { className: 'inline-flex p-3 rounded-xl mb-5 transition-transform duration-500', style: { background: cfg.accent + '18', transform: active ? 'scale(1.08)' : 'scale(1)' } },
                  React.createElement(cfg.Icon, { size: 22, style: { color: cfg.accent }, strokeWidth: 1.5 })
                ),
                React.createElement('h3', { className: 'text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-gray-100 mb-1', style: { fontFamily: FONT } }, cat.category),
                React.createElement('div', { className: 'text-[10px] font-semibold uppercase tracking-wider mb-4 transition-colors duration-200', style: { fontFamily: FONT, color: isSelected ? cfg.accent : '#94a3b8' } }, isSelected ? '\u2191 Expanded' : '\u2193 Click to explore'),
                React.createElement('div', { className: 'flex flex-wrap gap-2' },
                  cat.skills.map((skill, sIdx) => React.createElement(SkillTag, { key: sIdx, skill, accent: cfg.accent }))
                )
              )
            )
          );
        })
      ),

      React.createElement(AnimatePresence, null,
        selectedIdx !== null && React.createElement(DetailPanel, {
          key: selectedIdx,
          category: SKILLS[selectedIdx].category,
          cfg: CARD_CONFIG[selectedIdx % CARD_CONFIG.length],
          onClose: () => setSelectedIdx(null)
        })
      ),

      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden' },
        SKILLS.map((cat, idx) => {
          const cfg   = CARD_CONFIG[idx % CARD_CONFIG.length];
          const isSel = selectedIdx === idx;
          return (
            React.createElement(motion.div, {
              key: idx,
              initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: idx * 0.08 }, viewport: { once: true }
            },
              React.createElement('div', {
                onClick: () => handleClick(idx),
                className: ['p-5 rounded-2xl border cursor-pointer relative overflow-hidden transition-all duration-300 bg-white dark:bg-gray-900/60', isSel ? 'shadow-lg' : 'border-gray-200 dark:border-white/10'].join(' '),
                style: { borderColor: isSel ? cfg.accent : undefined, boxShadow: isSel ? '0 0 0 1.5px ' + cfg.accent + '60, 0 6px 24px ' + cfg.accent + '18' : undefined }
              },
                isSel && React.createElement('div', { className: 'absolute top-0 left-0 right-0 h-0.5', style: { background: cfg.accent } }),
                React.createElement('div', { className: 'inline-flex p-2.5 rounded-xl mb-4', style: { background: cfg.accent + '18' } },
                  React.createElement(cfg.Icon, { size: 20, style: { color: cfg.accent }, strokeWidth: 1.5 })
                ),
                React.createElement('h3', { className: 'text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-gray-100 mb-1', style: { fontFamily: FONT } }, cat.category),
                React.createElement('div', { className: 'text-[10px] font-semibold uppercase tracking-wider mb-3', style: { fontFamily: FONT, color: isSel ? cfg.accent : '#94a3b8' } }, isSel ? '\u2191 Collapse' : '\u2193 Tap to explore'),
                React.createElement('div', { className: 'flex flex-wrap gap-2' },
                  cat.skills.map((skill, sIdx) => React.createElement(SkillTag, { key: sIdx, skill, accent: cfg.accent }))
                )
              ),
              React.createElement(AnimatePresence, null,
                isSel && React.createElement(motion.div, {
                  key: 'mob-detail',
                  initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 },
                  transition: { duration: 0.65, ease: EASE }, style: { overflow: 'hidden' }
                },
                  React.createElement('div', { className: 'mt-3 p-5 rounded-2xl bg-white dark:bg-[#0d0b22] border border-gray-200 dark:border-white/10 shadow-lg' },
                    getProjectsForCategory(cat.category).map((proj, pi) =>
                      React.createElement('div', { key: pi, className: (pi > 0 ? 'mt-3 ' : '') + 'p-4 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-200/80 dark:border-white/8 relative overflow-hidden' },
                        React.createElement('div', { className: 'absolute top-0 left-0 right-0 h-px', style: { background: 'linear-gradient(90deg,' + cfg.accent + ',transparent)' } }),
                        React.createElement('div', { className: 'text-sm font-bold text-gray-900 dark:text-white mb-1', style: { fontFamily: FONT } }, proj.title),
                        React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400 mb-3', style: { fontFamily: FONT } }, proj.description),
                        React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
                          proj.tags.map((tag, ti) =>
                            React.createElement('span', { key: ti, className: 'text-[10px] font-bold px-2.5 py-0.5 rounded-full', style: { background: cfg.accent + '15', border: '1px solid ' + cfg.accent + '40', color: cfg.accent, fontFamily: FONT } }, tag)
                          )
                        )
                      )
                    ),
                    React.createElement('div', { className: 'mt-4', style: { height: 300 } },
                      React.createElement(MiniChat, { category: cat.category, accent: cfg.accent })
                    )
                  )
                )
              )
            )
          );
        })
      )
    )
  );
};

export default Skills;
