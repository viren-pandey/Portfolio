import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';

const AUTO_MS = 69000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '45%' : '-45%',
    opacity: 0,
    scale: 0.96,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-45%' : '45%',
    opacity: 0,
    scale: 0.96,
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
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDir(1);
      setActive((index) => (index + 1) % PROJECTS.length);
    }, AUTO_MS);
  }, []);

  useEffect(() => {
    if (!started) return;

    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, resetTimer]);

  const go = (index: number) => {
    setDir(index > active ? 1 : -1);
    setActive(index);
    resetTimer();
  };

  const project = PROJECTS[active];
  const compactPoints = project.points.slice(0, 3);
  const compactTags = project.tags.slice(0, 5);
  const compactStats = project.stats?.slice(0, 4) ?? [];
  const featuredLinks = project.featuredLinks?.slice(0, 4) ?? [];

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-14 text-center"
      >
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-3">Featured Work</h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
          Same flow, cleaner focus. Navigate projects and scan value quickly.
        </p>
      </motion.div>

      <div className="relative px-5 sm:px-8">
        <button
          onClick={() => go((active - 1 + PROJECTS.length) % PROJECTS.length)}
          className="absolute left-[-4px] sm:left-[-8px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
          aria-label="Previous project"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => go((active + 1) % PROJECTS.length)}
          className="absolute right-[-4px] sm:right-[-8px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 shadow-lg text-gray-700 dark:text-gray-300 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
          aria-label="Next project"
        >
          <ChevronRight size={18} />
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 shadow-sm dark:shadow-none">
          <div className="h-[4px] bg-black/5 dark:bg-white/10 overflow-hidden">
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
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-[#030014]/80 dark:backdrop-blur-sm p-8 sm:p-12 lg:p-14"
            >
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="flex gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/20 shadow-sm text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-400/40 transition-colors"
                        >
                          <Github size={14} />
                          GitHub
                        </a>
                      )}
                      {project.link && project.link !== project.github && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 shadow-sm text-sm sm:text-base font-semibold text-purple-500 dark:text-purple-300 hover:bg-purple-500/20 transition-colors"
                        >
                          <ExternalLink size={14} />
                          Live
                        </a>
                      )}
                      {project.apiLink && (
                        <a
                          href={project.apiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 shadow-sm text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-300 hover:bg-blue-500/20 transition-colors"
                        >
                          <ExternalLink size={14} />
                          API
                        </a>
                      )}
                    </div>

                    <span className="ml-auto font-mono text-xs sm:text-sm text-gray-400 tabular-nums">
                      {String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
                    </span>
                  </div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3 leading-tight"
                  >
                    {project.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                  >
                    {project.description}
                  </motion.p>

                  <ul className="space-y-3.5 mb-8">
                    {compactPoints.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-start gap-2.5 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-200"
                      >
                        <ChevronRight size={16} className="mt-1 flex-shrink-0 text-purple-500" />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2.5 mb-6"
                  >
                    {compactTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-500 dark:text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  {featuredLinks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.32 }}
                      className="mb-6"
                    >
                      <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Featured Pages &amp; Links
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {featuredLinks.map((item) => (
                          <a
                            key={item.label}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-600 dark:text-blue-300 hover:bg-blue-500/20 transition-colors"
                          >
                            <ExternalLink size={13} />
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {project.detailPath && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                      <Link
                        to={project.detailPath}
                        className="inline-flex items-center gap-2 text-base sm:text-lg font-semibold text-purple-500 dark:text-purple-300 hover:text-purple-400 transition-colors group/dl"
                      >
                        <BookOpen size={16} />
                        Deep Dive - Full System Breakdown
                        <ChevronRight size={14} className="transition-transform group-hover/dl:translate-x-1" />
                      </Link>
                    </motion.div>
                  )}
                </div>

                {compactStats.length > 0 && (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs font-bold uppercase tracking-[0.22em] text-purple-500 dark:text-purple-300 mb-4"
                    >
                      Impact &amp; Numbers
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3.5">
                      {compactStats.map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.16 + i * 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
                          className="rounded-2xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/[0.08] px-4 py-5 text-center"
                        >
                          <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                            {stat.value}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-2 leading-snug">
                            {stat.label}
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
            <span className="text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
              {p.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Projects;
