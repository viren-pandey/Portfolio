import React, { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ───────────────────────── shared reveal hook ───────────────────────── */

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ───────────────────────────── metrics ──────────────────────────────── */

const METRICS = [
  { value: '3', label: 'Products Built', desc: 'Live, full-stack AI systems' },
  { value: '2024', label: 'Building Since', desc: 'B.Tech CSE (AI/ML), AKTU' },
  { value: '15+', label: 'Technologies Used', desc: 'Across frontend, backend & ML' },
  { value: 'AI/ML', label: 'Core Focus', desc: 'Computer vision & automation' },
];

export const Metrics: React.FC = () => (
  <section className="px-4 sm:px-6 py-10 sm:py-12" aria-label="Key facts">
    <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {METRICS.map((m, i) => (
        <Reveal key={m.label} delay={i * 60}>
          <div className="glass glass-hover-lift h-full rounded-2xl px-5 py-4">
            <p className="text-xl sm:text-2xl font-display font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-fuchsia-500 to-blue-600 dark:from-violet-300 dark:via-fuchsia-300 dark:to-blue-300">
              {m.value}
            </p>
            <p className="text-[13px] font-semibold text-ink dark:text-gray-200 mt-0.5">{m.label}</p>
            <p className="text-xs text-navy-500 dark:text-gray-400 mt-1 leading-relaxed">{m.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ───────────────────────────── about ────────────────────────────────── */

const ABOUT_FACTS = [
  { label: 'Focus', value: 'Product engineering · AI systems · Automation' },
  { label: 'Currently building', value: 'Vian Software Solutions' },
  { label: 'Studying', value: 'B.Tech CSE (AI & ML), AKTU · 2024-2028' },
  { label: 'Technical interests', value: 'Web apps · APIs · Computer vision · Scalable systems' },
];

const About: React.FC = () => {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="about" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400 mb-3">
            About
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-white leading-tight mb-5 max-w-md">
            Building with curiosity, shipping with purpose.
          </h2>
          <div className="space-y-4 text-navy-500 dark:text-gray-400 leading-relaxed max-w-xl">
            <p>
              I'm Viren Pandey, a software developer and founder who enjoys turning rough ideas into
              working products. Most of my work sits at the intersection of web development, AI, and
              automation: real-time systems that watch, decide, and act.
            </p>
            <p>
              Through <span className="font-semibold text-ink dark:text-gray-200">Vian Software Solutions</span>,
              I build and operate software products end-to-end, from the first sketch of the data model
              to deployment, monitoring, and iteration. I like problems where engineering discipline
              matters: clean APIs, honest error handling, and interfaces that stay fast under pressure.
            </p>
            <p>
              My approach is practical. I'd rather ship something small and genuinely useful than
              over-engineer something nobody needs, then improve it in public, one honest iteration at a time.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={() => scrollTo('work')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink dark:bg-white text-white dark:text-ink text-sm font-semibold rounded-xl hover:bg-navy-700 dark:hover:bg-gray-200 transition-colors"
            >
              See my work
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-ink dark:text-white text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass rounded-[20px] p-6 sm:p-7 lg:mt-2">
            <h3 className="text-sm font-semibold text-ink dark:text-white mb-5">At a glance</h3>
            <dl className="space-y-4">
              {ABOUT_FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-navy-300 dark:text-gray-500 sm:w-36 shrink-0">
                    {fact.label}
                  </dt>
                  <dd className="text-sm text-ink dark:text-gray-200 leading-relaxed">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-300 dark:text-gray-500 mb-3">
                Elsewhere
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/viren-pandey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-navy-500 dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                >
                  <Github size={13} /> GitHub
                </a>
                <a
                  href="https://linkedin.com/in/viren-pandey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-navy-500 dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                >
                  <Linkedin size={13} /> LinkedIn
                </a>
                <a
                  href="mailto:pandeyviren78@gmail.com"
                  className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-navy-500 dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                >
                  <Mail size={13} /> Email
                </a>
              </div>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-navy-300 dark:text-gray-500">
                <MapPin size={12} />
                Varanasi, India · Open to remote work
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default About;