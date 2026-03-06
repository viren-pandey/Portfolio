// --- Technical Arsenal - Skills.tsx ------------------------------------------
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
    if (proj.length === 0) return 'No dedicated project for ' + category + ' yet, but here is what Viren learned:\n\n' + ctx;
    const list = proj.map(p => '\u2022 ' + p.title + ' \u2014 ' + p.description).join('\n');
    return 'In the ' + category + ' domain, Viren has built:\n\n' + list + '\n\n' + ctx;
  }
  if (q.match(/tech|stack|tool|language|framework|use/)) {
    const skills = SKILLS.find(s => s.category === category);
    return 'For ' + category + ', Viren uses: ' + (skills ? skills.skills.join(', ') : 'various tools') + '.\n\n' + ctx;
  }
  if (q.match(/achiev|result|impact|outcome|key/)) {
    const points = proj.flatMap(p => p.points).map(pt => '\u2022 ' + pt).join('\n');
    return 'Key achievements:\n\n' + points;
  }
  if (q.match(/how|explain|detail|describ/)) return ctx;
  if (q.match(/hello|hi|hey/)) return 'Hey! Ask me anything about Viren\'s ' + category + ' work!';
  return 'Great question! Here is what I know about Viren\'s ' + category + ' expertise:\n\n' + ctx;
}

// Reliable dark mode hook - reads from html.classList, updates on change
function useDark() {
  const [dark, setDark] = React.useState(function() {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });
  React.useEffect(function() {
    var el = document.documentElement;
    var obs = new MutationObserver(function() {
      setDark(el.classList.contains('dark'));
    });
    obs.observe(el, { attributeFilter: ['class'] });
    return function() { obs.disconnect(); };
  }, []);
  return dark;
}

// Theme tokens - all colors in one place
function T(dark) {
  return {
    panelBg:   dark ? '#111827' : '#ffffff',
    cardBg:    dark ? '#1f2937' : '#f9fafb',
    inputBg:   dark ? '#1f2937' : '#f3f4f6',
    border:    dark ? '#374151' : '#e5e7eb',
    borderSub: dark ? '#374151' : '#f3f4f6',
    text:      dark ? '#f9fafb' : '#111827',
    textSub:   dark ? '#9ca3af' : '#6b7280',
    textMuted: dark ? '#6b7280' : '#9ca3af',
    closeBg:   dark ? '#374151' : '#f3f4f6',
    closeHov:  dark ? '#4b5563' : '#e5e7eb',
  };
}

const SkillTag = function(props) {
  var skill = props.skill; var accent = props.accent;
  return React.createElement('span', {
    className: 'inline-block text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200',
    style: { fontFamily: FONT, background: accent + '18', border: '1px solid ' + accent + '45', color: accent }
  }, skill);
};

var QUICK_QS = ['What did you build here?', 'Technologies used?', 'Key achievements?', 'How does this work?'];

const MiniChat = function(props) {
  var category = props.category; var accent = props.accent; var isDark = props.isDark;
  var t = T(isDark);

  var _msgs = React.useState([{ role: 'bot', text: 'Hi! Ask me about Viren\'s ' + category + ' work. Powered by Groq AI!' }]);
  var msgs = _msgs[0]; var setMsgs = _msgs[1];
  var _input = React.useState(''); var input = _input[0]; var setInput = _input[1];
  var _loading = React.useState(false); var loading = _loading[0]; var setLoading = _loading[1];
  var scrollRef = React.useRef(null);

  React.useEffect(function() {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  var send = async function(text) {
    if (!text.trim() || loading) return;
    var history = msgs;
    setInput('');
    setMsgs(function(prev) { return prev.concat([{ role: 'user', text: text }]); });
    setLoading(true);
    try {
      var catSkills = SKILLS.find(function(s) { return s.category === category; });
      var projList = getProjectsForCategory(category)
        .map(function(p) { return p.title + ': ' + p.description + '. Stack: ' + p.tags.join(', ') + '.'; })
        .join('\n');
      var sysPrompt =
        'You are an AI assistant embedded in Viren Pandey\'s portfolio website. ' +
        'Answer visitor questions about his ' + category + ' skills concisely and accurately.\n\n' +
        'Skills in this category: ' + (catSkills ? catSkills.skills.join(', ') : 'various') + '\n\n' +
        'Background: ' + (CATEGORY_CONTEXT[category] || '') + '\n\n' +
        (projList ? 'Related projects:\n' + projList : 'No dedicated projects yet. Focus on what was learned.') +
        '\n\nKeep replies friendly and under 4 sentences unless asked for detail. Use plain text, no markdown.';
      var messages = [{ role: 'system', content: sysPrompt }]
        .concat(history.map(function(m) { return { role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }; }))
        .concat([{ role: 'user', content: text }]);

      // Try serverless proxy first (production)
      var reply = null;
      try {
        var res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages }),
        });
        if (res.ok) {
          var data = await res.json();
          reply = data.reply || null;
        }
      } catch(e) { reply = null; }

      // Fallback: client-side Groq with VITE key (local dev)
      if (!reply) {
        var viteKey = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_GROQ_API_KEY : null;
        if (viteKey && viteKey !== 'your_groq_api_key_here') {
          try {
            var gr = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + viteKey },
              body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: messages, max_tokens: 350, temperature: 0.7 }),
            });
            if (gr.ok) {
              var gd = await gr.json();
              reply = (gd.choices && gd.choices[0] && gd.choices[0].message && gd.choices[0].message.content)
                ? gd.choices[0].message.content.trim() : null;
            }
          } catch(e2) { reply = null; }
        }
      }

      setMsgs(function(prev) { return prev.concat([{ role: 'bot', text: reply || genResponse(text, category) }]); });
    } catch(e) {
      setMsgs(function(prev) { return prev.concat([{ role: 'bot', text: genResponse(text, category) }]); });
    }
    setLoading(false);
  };

  return React.createElement('div', { className: 'flex flex-col h-full gap-3', style: { fontFamily: FONT } },
    // Header
    React.createElement('div', { className: 'flex items-center gap-3 pb-3', style: { borderBottom: '1px solid ' + t.border } },
      React.createElement('div', { className: 'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', style: { background: accent + '20' } },
        React.createElement(Bot, { size: 17, style: { color: accent } })
      ),
      React.createElement('div', null,
        React.createElement('div', { className: 'text-sm font-bold', style: { color: t.text } }, "Viren's AI Assistant"),
        React.createElement('div', { className: 'flex items-center gap-1.5' },
          React.createElement('div', { className: 'w-1.5 h-1.5 rounded-full bg-emerald-500', style: { animation: 'pulse 2s infinite' } }),
          React.createElement('span', { className: 'text-[10px] font-semibold uppercase tracking-widest', style: { color: t.textMuted } }, 'Online')
        )
      )
    ),
    // Messages
    React.createElement('div', { ref: scrollRef, className: 'flex-1 overflow-y-auto flex flex-col gap-2 min-h-0', style: { scrollbarWidth: 'thin' } },
      msgs.map(function(m, i) {
        return React.createElement('div', { key: i, className: 'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start') },
          React.createElement('div', {
            className: 'max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed font-medium',
            style: {
              fontFamily: FONT,
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? accent : t.inputBg,
              color: m.role === 'user' ? '#ffffff' : t.text,
              border: m.role === 'bot' ? '1px solid ' + t.border : 'none',
              whiteSpace: 'pre-wrap',
            }
          }, m.text)
        );
      }),
      loading && React.createElement('div', {
        className: 'flex gap-1.5 px-4 py-3 rounded-2xl w-[68px]',
        style: { background: t.inputBg, border: '1px solid ' + t.border }
      },
        [0,1,2].map(function(i) {
          return React.createElement('div', { key: i, style: { width: 6, height: 6, borderRadius: '50%', background: accent, animation: 'bounce 0.9s ' + (i * 0.15) + 's ease-in-out infinite' } });
        })
      )
    ),
    // Quick chips
    React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
      QUICK_QS.map(function(q, i) {
        return React.createElement('button', {
          key: i, onClick: function() { send(q); },
          className: 'px-2.5 py-1 rounded-full text-[11px] font-semibold transition-opacity hover:opacity-70',
          style: { background: accent + '15', border: '1px solid ' + accent + '40', color: accent, fontFamily: FONT }
        }, q);
      })
    ),
    // Input
    React.createElement('div', {
      className: 'flex gap-2 rounded-2xl px-4 py-2 items-center',
      style: { background: t.inputBg, border: '1px solid ' + t.border }
    },
      React.createElement('input', {
        value: input,
        onChange: function(e) { setInput(e.target.value); },
        onKeyDown: function(e) { if (e.key === 'Enter' && !e.shiftKey) send(input); },
        placeholder: 'Ask about ' + category + '...',
        className: 'flex-1 bg-transparent border-none outline-none text-sm',
        style: { fontFamily: FONT, color: t.text }
      }),
      React.createElement('button', {
        onClick: function() { send(input); },
        className: 'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
        style: { background: accent }
      }, React.createElement(Send, { size: 14, color: '#fff' }))
    )
  );
};

const DetailPanel = function(props) {
  var category = props.category; var cfg = props.cfg; var onClose = props.onClose; var isDark = props.isDark;
  var projects = getProjectsForCategory(category);
  var accent = cfg.accent;
  var t = T(isDark);

  return React.createElement(motion.div, {
    key: category,
    initial: { opacity: 0, y: -14, scaleY: 0.95 },
    animate: { opacity: 1, y: 0, scaleY: 1 },
    exit: { opacity: 0, y: -8, scaleY: 0.97 },
    transition: { duration: 0.75, ease: EASE },
    className: 'mt-5 rounded-3xl shadow-xl overflow-hidden',
    style: { originY: 0, background: t.panelBg, border: '1px solid ' + t.border }
  },
    // Accent top line
    React.createElement('div', { style: { height: 2, background: 'linear-gradient(90deg,' + accent + ',transparent)' } }),
    // Header
    React.createElement('div', {
      className: 'flex items-center justify-between px-7 py-5',
      style: { borderBottom: '1px solid ' + t.border }
    },
      React.createElement('div', { className: 'flex items-center gap-3' },
        React.createElement('div', { className: 'p-2.5 rounded-xl', style: { background: accent + '18' } },
          React.createElement(cfg.Icon, { size: 20, style: { color: accent }, strokeWidth: 1.5 })
        ),
        React.createElement('div', null,
          React.createElement('div', { className: 'text-[10px] font-bold uppercase tracking-widest mb-0.5', style: { color: accent, fontFamily: FONT } }, category),
          React.createElement('div', { className: 'text-base font-bold', style: { color: t.text, fontFamily: FONT } },
            projects.length > 0 ? 'Projects & Achievements' : 'What I Learned'
          )
        )
      ),
      React.createElement('button', {
        onClick: onClose,
        className: 'w-8 h-8 rounded-full flex items-center justify-center transition-all',
        style: { background: t.closeBg, color: t.textSub }
      }, React.createElement(X, { size: 15 }))
    ),
    // Body
    projects.length === 0
      ? React.createElement('div', { className: 'p-6 flex flex-col', style: { minHeight: 440 } },
          React.createElement(MiniChat, { category: category, accent: accent, isDark: isDark })
        )
      : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 360px' } },
          // Projects column
          React.createElement('div', {
            className: 'p-6 flex flex-col gap-4 overflow-y-auto max-h-[480px]',
            style: { borderRight: '1px solid ' + t.border }
          },
            projects.map(function(proj, i) {
              return React.createElement(motion.div, {
                key: i,
                initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 },
                transition: { duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE },
                className: 'p-5 rounded-2xl relative overflow-hidden',
                style: { background: t.cardBg, border: '1px solid ' + t.border }
              },
                React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,' + accent + ',transparent)' } }),
                React.createElement('div', { className: 'flex items-start justify-between gap-3 mb-2' },
                  React.createElement('div', null,
                    React.createElement('div', { className: 'text-base font-bold mb-1', style: { color: t.text, fontFamily: FONT } }, proj.title),
                    React.createElement('div', { className: 'text-xs', style: { color: t.textSub, fontFamily: FONT } }, proj.description)
                  ),
                  React.createElement('div', { className: 'flex gap-2 flex-shrink-0' },
                    proj.github && React.createElement('a', {
                      href: proj.github, target: '_blank', rel: 'noreferrer',
                      className: 'w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-75 transition-opacity',
                      style: { background: accent + '15', border: '1px solid ' + accent + '40', color: accent }
                    }, React.createElement(Github, { size: 13 })),
                    proj.link && React.createElement('a', {
                      href: proj.link, target: '_blank', rel: 'noreferrer',
                      className: 'w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-75 transition-opacity',
                      style: { background: accent + '15', border: '1px solid ' + accent + '40', color: accent }
                    }, React.createElement(ExternalLink, { size: 13 }))
                  )
                ),
                React.createElement('ul', { className: 'mt-3 flex flex-col gap-1.5' },
                  proj.points.map(function(pt, pi) {
                    return React.createElement('li', { key: pi, className: 'flex gap-2 items-start text-xs', style: { color: t.textSub, fontFamily: FONT, lineHeight: 1.6 } },
                      React.createElement(ChevronRight, { size: 11, style: { color: accent, flexShrink: 0, marginTop: 3 } }),
                      pt
                    );
                  })
                ),
                React.createElement('div', { className: 'flex flex-wrap gap-1.5 mt-3' },
                  proj.tags.map(function(tag, ti) {
                    return React.createElement('span', { key: ti, className: 'text-[10px] font-bold px-2.5 py-0.5 rounded-full', style: { fontFamily: FONT, background: accent + '15', border: '1px solid ' + accent + '40', color: accent } }, tag);
                  })
                )
              );
            })
          ),
          // Chat column
          React.createElement('div', { className: 'p-6 flex flex-col max-h-[480px]' },
            React.createElement(MiniChat, { category: category, accent: accent, isDark: isDark })
          )
        )
  );
};

const Skills = function() {
  var isDark = useDark();
  var _hov = React.useState(null); var hoveredIdx = _hov[0]; var setHoveredIdx = _hov[1];
  var _sel = React.useState(null); var selectedIdx = _sel[0]; var setSelectedIdx = _sel[1];
  var handleClick = function(idx) { setSelectedIdx(function(prev) { return prev === idx ? null : idx; }); };
  var t = T(isDark);

  return React.createElement('div', { className: 'relative max-w-6xl mx-auto px-6', style: { fontFamily: FONT } },
    React.createElement('style', null, '@keyframes bounce{0%,80%,100%{transform:scale(0);opacity:0.3}40%{transform:scale(1);opacity:1}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}'),

    // Heading
    React.createElement('div', { className: 'flex flex-col items-center mb-14' },
      React.createElement(motion.h2, {
        initial: { opacity: 0, y: -16 }, whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.7 }, viewport: { once: true },
        className: 'text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white',
        style: { fontFamily: FONT }
      }, 'Technical Arsenal'),
      React.createElement('div', { className: 'h-0.5 w-24 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400' }),
      React.createElement('p', { className: 'mt-4 text-sm font-medium text-gray-500 dark:text-gray-400', style: { fontFamily: FONT } },
        'Click any card to explore projects & ask the AI assistant'
      )
    ),

    // Desktop flex row
    React.createElement('div', { className: 'hidden lg:flex gap-4 items-stretch' },
      SKILLS.map(function(cat, idx) {
        var cfg        = CARD_CONFIG[idx % CARD_CONFIG.length];
        var isSelected = selectedIdx === idx;
        var isHovered  = hoveredIdx === idx;
        var isCollapsed= hoveredIdx !== null && selectedIdx === null && idx === hoveredIdx + 1;
        var active     = isHovered || isSelected;
        return React.createElement(motion.div, {
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
            onClick: function() { handleClick(idx); },
            onMouseEnter: function() { setHoveredIdx(idx); },
            onMouseLeave: function() { setHoveredIdx(null); },
            className: 'h-full rounded-2xl border cursor-pointer relative overflow-hidden bg-white dark:bg-gray-900',
            style: {
              padding: isCollapsed ? '28px 0' : '24px',
              opacity: isCollapsed ? 0 : 1,
              borderColor: active ? cfg.accent : undefined,
              border: '1px solid ' + (active ? cfg.accent : t.border),
              boxShadow: isSelected ? '0 0 0 1.5px ' + cfg.accent + '60, 0 8px 32px ' + cfg.accent + '18' : undefined,
              transition: 'all 0.3s ease, padding 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
            }
          },
            isSelected && React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: cfg.accent } }),
            React.createElement('div', {
              className: 'inline-flex p-3 rounded-xl mb-5 transition-transform duration-500',
              style: { background: cfg.accent + '18', transform: active ? 'scale(1.08)' : 'scale(1)' }
            },
              React.createElement(cfg.Icon, { size: 22, style: { color: cfg.accent }, strokeWidth: 1.5 })
            ),
            React.createElement('h3', { className: 'text-sm font-bold uppercase tracking-widest mb-1 text-gray-800 dark:text-gray-100', style: { fontFamily: FONT } }, cat.category),
            React.createElement('div', {
              className: 'text-[10px] font-semibold uppercase tracking-wider mb-4',
              style: { fontFamily: FONT, color: isSelected ? cfg.accent : t.textMuted }
            }, isSelected ? '\u2191 Expanded' : '\u2193 Click to explore'),
            React.createElement('div', { className: 'flex flex-wrap gap-2' },
              cat.skills.map(function(skill, sIdx) { return React.createElement(SkillTag, { key: sIdx, skill: skill, accent: cfg.accent }); })
            )
          )
        );
      })
    ),

    // Desktop detail panel
    React.createElement(AnimatePresence, null,
      selectedIdx !== null && React.createElement(DetailPanel, {
        key: selectedIdx,
        category: SKILLS[selectedIdx].category,
        cfg: CARD_CONFIG[selectedIdx % CARD_CONFIG.length],
        onClose: function() { setSelectedIdx(null); },
        isDark: isDark,
      })
    ),

    // Mobile grid
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden' },
      SKILLS.map(function(cat, idx) {
        var cfg   = CARD_CONFIG[idx % CARD_CONFIG.length];
        var isSel = selectedIdx === idx;
        return React.createElement(motion.div, {
          key: idx,
          initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: idx * 0.08 }, viewport: { once: true }
        },
          React.createElement('div', {
            onClick: function() { handleClick(idx); },
            className: 'p-5 rounded-2xl border cursor-pointer relative overflow-hidden transition-all duration-300 bg-white dark:bg-gray-900',
            style: {
              border: '1px solid ' + (isSel ? cfg.accent : t.border),
              boxShadow: isSel ? '0 0 0 1.5px ' + cfg.accent + '60, 0 6px 24px ' + cfg.accent + '18' : undefined
            }
          },
            isSel && React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: cfg.accent } }),
            React.createElement('div', { className: 'inline-flex p-2.5 rounded-xl mb-4', style: { background: cfg.accent + '18' } },
              React.createElement(cfg.Icon, { size: 20, style: { color: cfg.accent }, strokeWidth: 1.5 })
            ),
            React.createElement('h3', { className: 'text-sm font-bold uppercase tracking-widest mb-1 text-gray-800 dark:text-gray-100', style: { fontFamily: FONT } }, cat.category),
            React.createElement('div', {
              className: 'text-[10px] font-semibold uppercase tracking-wider mb-3',
              style: { fontFamily: FONT, color: isSel ? cfg.accent : t.textMuted }
            }, isSel ? '\u2191 Collapse' : '\u2193 Tap to explore'),
            React.createElement('div', { className: 'flex flex-wrap gap-2' },
              cat.skills.map(function(skill, sIdx) { return React.createElement(SkillTag, { key: sIdx, skill: skill, accent: cfg.accent }); })
            )
          ),
          React.createElement(AnimatePresence, null,
            isSel && React.createElement(motion.div, {
              key: 'mob-detail',
              initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 },
              transition: { duration: 0.65, ease: EASE }, style: { overflow: 'hidden' }
            },
              React.createElement('div', {
                className: 'mt-3 p-5 rounded-2xl shadow-lg',
                style: { background: t.panelBg, border: '1px solid ' + t.border }
              },
                getProjectsForCategory(cat.category).map(function(proj, pi) {
                  return React.createElement('div', {
                    key: pi,
                    className: (pi > 0 ? 'mt-3 ' : '') + 'p-4 rounded-xl relative overflow-hidden',
                    style: { background: t.cardBg, border: '1px solid ' + t.border }
                  },
                    React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,' + cfg.accent + ',transparent)' } }),
                    React.createElement('div', { className: 'text-sm font-bold mb-1', style: { color: t.text, fontFamily: FONT } }, proj.title),
                    React.createElement('div', { className: 'text-xs mb-3', style: { color: t.textSub, fontFamily: FONT } }, proj.description),
                    React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
                      proj.tags.map(function(tag, ti) {
                        return React.createElement('span', { key: ti, className: 'text-[10px] font-bold px-2.5 py-0.5 rounded-full', style: { background: cfg.accent + '15', border: '1px solid ' + cfg.accent + '40', color: cfg.accent, fontFamily: FONT } }, tag);
                      })
                    )
                  );
                }),
                React.createElement('div', { className: 'mt-4', style: { height: 300 } },
                  React.createElement(MiniChat, { category: cat.category, accent: cfg.accent, isDark: isDark })
                )
              )
            )
          )
        );
      })
    )
  );
};

export default Skills;
