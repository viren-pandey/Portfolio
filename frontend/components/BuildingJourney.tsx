import React from 'react';
import { Rocket, GraduationCap, Flag } from 'lucide-react';
import { EDUCATION } from '../constants';
import { Reveal } from './About';

const MILESTONES = [
  {
    year: '2024',
    title: 'Started B.Tech, CSE (AI & ML)',
    org: 'AKTU, Varanasi',
    desc: 'Began specializing in artificial intelligence and machine learning, and started building production-grade projects alongside coursework.',
    icon: GraduationCap,
  },
  {
    year: '2024–2025',
    title: 'Shipped first full-stack AI systems',
    org: 'SpaceDebrisAI · SmartCrowd · DualityAI',
    desc: 'Built and deployed three live systems: real-time satellite conjunction monitoring, YOLOv8 crowd safety analysis, and space-station object detection, each with a working frontend, backend, and public demo.',
    icon: Rocket,
  },
  {
    year: 'Now',
    title: 'Building Vian Software Solutions',
    org: 'Founder',
    desc: 'Focused on software products and digital growth infrastructure: web platforms, APIs, and automation systems, engineered end-to-end.',
    icon: Flag,
  },
];

const BuildingJourney: React.FC = () => {
  return (
    <section id="experience" className="px-4 sm:px-6 py-16 sm:py-24 bg-white dark:bg-white/[0.015] border-y border-gray-100 dark:border-white/5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600 dark:text-violet-400 mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-white leading-tight mb-5 max-w-sm">
            What I've been building.
          </h2>
          <p className="text-base text-navy-500 dark:text-gray-400 leading-relaxed max-w-md mb-8">
            A short, honest timeline, from specializing in AI to shipping full-stack systems and
            founding a software company.
          </p>

          {/* Certifications summary */}
          <div className="glass rounded-[20px] shadow-card p-5 max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-300 dark:text-gray-500 mb-3">
              Certified across
            </p>
            <div className="flex flex-wrap gap-2">
              {['Oracle Cloud AI', 'Cisco CyberSecurity', 'Google Cloud ML', 'NVIDIA GenAI'].map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-md glass-chip text-[11px] font-medium text-navy-500 dark:text-gray-400"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-navy-300 dark:text-gray-500 mt-3">
              Full list with verification links in the academics section below.
            </p>
          </div>
        </Reveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gray-200 dark:bg-white/10" aria-hidden="true" />

          <div className="space-y-8">
            {MILESTONES.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="relative pl-14">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-xl glass shadow-card flex items-center justify-center bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-violet-600 dark:text-violet-400">
                    <item.icon size={18} />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-300/40 dark:border-violet-500/30 text-[11px] font-semibold text-violet-700 dark:text-violet-300 mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-display font-bold text-ink dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[13px] font-semibold text-navy-500 dark:text-gray-400 mb-1.5">{item.org}</p>
                  <p className="text-sm text-navy-500 dark:text-gray-400 leading-relaxed max-w-lg">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Education detail */}
          <Reveal delay={200}>
            <div className="relative pl-14 mt-10">
              <div className="rounded-[20px] glass divide-y divide-gray-100 dark:divide-white/5">
                {EDUCATION.map((edu) => (
                  <div key={edu.institution} className="p-5">
                    <p className="text-xs text-navy-300 dark:text-gray-500 mb-1">{edu.period}</p>
                    <h4 className="text-sm font-semibold text-ink dark:text-white">{edu.institution}</h4>
                    <p className="text-[13px] text-navy-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {edu.degree}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default BuildingJourney;
