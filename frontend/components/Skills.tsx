// --- Technical Arsenal - Skills.tsx ------------------------------------------
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS, PROJECTS } from '../constants';
import { Code2, Brain, Server, Cloud, X, ExternalLink, Github, ChevronRight } from 'lucide-react';

const FONT = "'Montserrat', sans-serif";
const EASE = [0.16, 1, 0.3, 1];

const CARD_CONFIG = [
  { Icon: Code2,  accent: '#06b6d4' },
  { Icon: Brain,  accent: '#8b5cf6' },
  { Icon: Server, accent: '#10b981' },
  { Icon: Cloud,  accent: '#f59e0b' },
];

const CATEGORY_CONTEXT = {};

function getProjectsForCategory(category: string) {
  const cat = SKILLS.find(s => s.category === category);
  if (!cat) return [];
  const skillSet = new Set(cat.skills.map(s => s.toLowerCase()));
  return PROJECTS.filter(p => p.tags.some(t => skillSet.has(t.toLowerCase())));
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
function T(dark: boolean) {
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

const SkillTag = function(props: { skill: string; accent: string }) {
  var skill = props.skill; var accent = props.accent;
  return React.createElement('span', {
    className: 'inline-block text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200',
    style: { fontFamily: FONT, background: accent + '18', border: '1px solid ' + accent + '45', color: accent }
  }, skill);
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
      ? React.createElement('div', { className: 'p-8 flex flex-col items-center justify-center', style: { minHeight: 260 } },
          React.createElement('div', { className: 'text-center' },
            React.createElement('div', { className: 'text-5xl mb-4' }, '\uD83D\uDD2D'),
            React.createElement('p', { className: 'font-bold mb-1.5', style: { color: t.text, fontFamily: FONT } }, 'No dedicated project yet'),
            React.createElement('p', { className: 'text-sm', style: { color: t.textSub, fontFamily: FONT } }, 'Check back soon!')
          )
        )
      : React.createElement('div', {
          className: 'p-6 grid gap-4 overflow-y-auto max-h-[540px]',
          style: { gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }
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
        'Click any card to explore projects'
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
                })
              )
            )
          )
        );
      })
    )
  );
};

export default Skills;
