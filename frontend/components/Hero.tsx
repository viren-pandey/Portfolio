import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Activity } from 'lucide-react';

interface HeroProps {
  onOpenTerminal: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      <div className="hero-lines absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <div className="glass-chip inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent dark:bg-violet-400" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-accent-600 dark:text-violet-300">
              Founder · Software Developer · Product Builder
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-display font-bold tracking-tight text-ink dark:text-white leading-[1.1] max-w-[680px] mb-6">
            Building digital products that feel{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-violet-400">simple, fast, and useful.</span>
          </h1>

          <p className="text-base sm:text-lg text-navy-500 dark:text-gray-400 max-w-[660px] leading-relaxed mb-8">
            I'm Viren Pandey, a developer and founder working across software products, automation, AI
            systems, and web applications. I care about clean architecture, real-world utility, and
            shipping things that actually work.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToWork}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
            >
              View My Work
              <ArrowRight size={16} />
            </motion.button>

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="glass-btn inline-flex items-center gap-2 px-6 py-3 text-ink dark:text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Get In Touch
              </Link>
            </motion.div>
          </div>

          <p className="inline-flex items-center gap-2 text-sm text-navy-500 dark:text-gray-400">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Currently building Vian Software Solutions.
          </p>
        </motion.div>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md w-full mx-auto lg:mx-0 lg:justify-self-end"
        >
          <div className="glass-strong rounded-[20px] p-5 sm:p-6">
            {/* Card header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/70 dark:border-emerald-500/20 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <Activity size={11} />
                  Active
                </span>
                <span className="text-xs text-navy-300 dark:text-gray-500">status · v1</span>
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-violet-200 dark:bg-violet-500/30" />
              </div>
            </div>

            {/* Currently building */}
            <div className="glass-chip rounded-xl p-4 mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-navy-300 dark:text-gray-500 mb-1">
                Currently building
              </p>
              <p className="text-sm font-semibold text-ink dark:text-white mb-1">Vian Software Solutions</p>
              <p className="text-xs text-navy-500 dark:text-gray-400 leading-relaxed">
                Software products &amp; digital growth infrastructure: web platforms, APIs, and automation.
              </p>
            </div>

            {/* Focus areas */}
            <div className="space-y-2.5 mb-4">
              {[
                { label: 'Full-Stack Development', detail: 'React · Node · TypeScript' },
                { label: 'AI & Automation', detail: 'YOLOv8 · FastAPI · LLM APIs' },
                { label: 'Product Engineering', detail: 'Vian Software Solutions' },
              ].map((row) => (
                <div key={row.label} className="glass-chip flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg">
                  <span className="text-[13px] font-medium text-ink dark:text-gray-200">{row.label}</span>
                  <span className="text-[11px] text-navy-300 dark:text-gray-500 text-right">{row.detail}</span>
                </div>
              ))}
            </div>

            {/* Footer link */}
            <button
              onClick={onOpenTerminal}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-ink dark:bg-white/10 text-white dark:text-gray-200 text-[13px] font-semibold hover:bg-navy-700 dark:hover:bg-white/15 transition-colors shadow-card"
            >
              <Terminal size={14} />
              Open Interactive Terminal
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
