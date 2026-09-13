import React from 'react';
import { Code2, Brain, Server, Cloud } from 'lucide-react';
import { SKILLS } from '../constants';
import { Reveal } from './About';

const CATEGORY_META: Record<string, { Icon: React.ElementType }> = {
  'Core Technologies': { Icon: Code2 },
  'ML Frameworks': { Icon: Brain },
  'Web & Backend': { Icon: Server },
  'Tools & Clouds': { Icon: Cloud },
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 mb-3">
            Tech Stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-white mb-4">
            Tools I build with
          </h2>
          <p className="text-base text-navy-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            A working toolkit across languages, ML frameworks, backend systems, and cloud. Every
            item here shows up in real shipped projects.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {SKILLS.map((cat, i) => {
            const meta = CATEGORY_META[cat.category] ?? { Icon: Code2 };
            return (
              <Reveal key={cat.category} delay={(i % 2) * 80} className="h-full">
                <div className="glass glass-hover-lift h-full rounded-[20px] p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex p-2.5 rounded-xl glass-chip bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-blue-500/15 text-violet-600 dark:text-violet-400">
                      <meta.Icon size={18} strokeWidth={1.8} />
                    </span>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-ink dark:text-white">
                      {cat.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg glass-chip text-[13px] font-medium text-navy-500 dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
