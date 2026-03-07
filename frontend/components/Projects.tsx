import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';

const AUTO_MS = 69000; // 1 min 9 sec

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '55%' : '-55%',
    opacity: 0,
    scale: 0.93,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-55%' : '55%',
    opacity: 0,
    scale: 0.93,
  }),
};

const Projects: React.FC = () => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDir(1);
      setActive(i => (i + 1) % PROJECTS.length);
    }, AUTO_MS);
  }, []);

  useEffect(() => {
    if (!started) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, resetTimer]);

  const go = (idx: number) => {
    setDir(idx > active ? 1 : -1);
    setActive(idx);
    resetTimer();
  };

  const project = PROJECTS[active];

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-16"
      >
        <h2 className="text-4xl font-display font-bold mb-4">Featured Work</h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
      </motion.div>

      {/* Arrow vibration keyframes */}
      <style>{`
        @keyframes arrow-buzz {
          0%,60%,100% { transform: translateY(-50%) translateX(0) rotate(0deg); }
          62%          { transform: translateY(-50%) translateX(-3px) rotate(-4deg); }
          64%          { transform: translateY(-50%) translateX(3px) rotate(4deg); }
          66%          { transform: translateY(-50%) translateX(-3px) rotate(-3deg); }
          68%          { transform: translateY(-50%) translateX(2px) rotate(3deg); }
          70%          { transform: translateY(-50%) translateX(-1px) rotate(-1deg); }
          72%          { transform: translateY(-50%) translateX(0) rotate(0deg); }
        }
        .arrow-btn {
          animation: arrow-buzz 4s ease-in-out infinite;
        }
        .arrow-btn:hover {
          animation: none;
          transform: translateY(-50%) scale(1.1);
        }
        .arrow-btn:active {
          transform: translateY(-50%) scale(0.92);
        }
      `}</style>

      <div className="relative px-6 sm:px-8">
        <button
          onClick={() => go((active - 1 + PROJECTS.length) % PROJECTS.length)}
          className="arrow-btn absolute left-[-4px] sm:left-[-8px] top-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg text-gray-700 dark:text-gray-300 backdrop-blur-sm"
          style={{ animationDelay: '2s' }}
          aria-label="Previous project"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => go((active + 1) % PROJECTS.length)}
          className="arrow-btn absolute right-[-4px] sm:right-[-8px] top-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg text-gray-700 dark:text-gray-300 backdrop-blur-sm"
          style={{ animationDelay: '0s' }}
          aria-label="Next project"
        >
          <ChevronRight size={18} />
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="h-[3px] bg-black/5 dark:bg-white/10 overflow-hidden">
            <motion.div
              key={`prog-${active}`}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 origin-left"
              initial={{ scaleX: 0 }}
              animate={started ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={active}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-[#030014]/80 dark:backdrop-blur-sm p-8 sm:p-12"
            >
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex gap-2">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/20 shadow-sm text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-400/40 transition-colors">
                          <Github size={13} />
                          GitHub
                        </a>
                      )}
                      {project.link && project.link !== project.github && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 shadow-sm text-xs font-medium text-purple-400 hover:bg-purple-500/20 transition-colors">
                          <ExternalLink size={13} />
                          Live
                        </a>
                      )}
                    </div>
                    <span className="ml-auto font-mono text-xs text-gray-400 tabular-nums">
                      {String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
                    </span>
                  </div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight"
                  >
                    {project.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 dark:text-gray-400 italic mb-7 text-sm"
                  >
                    {project.description}
                  </motion.p>

                  <ul className="space-y-3 mb-8">
                    {project.points.map((pt, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-purple-500" />
                        <span>{pt}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  {project.detailPath && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                      <Link
                        to={project.detailPath}
                        className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors group/dl"
                      >
                        <BookOpen size={14} />
                        Deep Dive — Full System Breakdown
                        <ChevronRight size={13} className="transition-transform group-hover/dl:translate-x-1" />
                      </Link>
                    </motion.div>
                  )}
                </div>

                {project.stats && project.stats.length > 0 && (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-4"
                    >
                      Impact &amp; Numbers
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3">
                      {project.stats.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.88 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.18 + i * 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
                          className="rounded-2xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/[0.08] px-4 py-4 text-center flex flex-col items-center justify-center"
                        >
                          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                            {s.value}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 leading-snug max-w-[110px]">
                            {s.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex justify-center items-center gap-6">
        {PROJECTS.map((p, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${
              i === active ? 'opacity-100 scale-100' : 'opacity-35 scale-95 hover:opacity-60'
            }`}
          >
            <div
              className={`rounded-full transition-all duration-500 ${
                i === active
                  ? 'w-12 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500'
                  : 'w-4 h-1.5 bg-gray-400 dark:bg-gray-600'
              }`}
            />
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
              {p.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Projects;
