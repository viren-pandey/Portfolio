import React from 'react';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { Reveal } from './About';

const Projects: React.FC = () => {
  return (
    <section id="work" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-violet-600 dark:from-fuchsia-400 dark:to-violet-400 mb-3">
            Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink dark:text-white mb-4">
            Projects built end-to-end
          </h2>
          <p className="text-base text-navy-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            Full-stack systems I designed, engineered, and shipped, from orbital mechanics to
            real-time computer vision.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={(i % 2) * 80} className="h-full">
              <article className="glass glass-hover-lift group h-full flex flex-col rounded-[20px] overflow-hidden">
                {/* Card top: category strip */}
                <div className="px-6 sm:px-7 pt-6 sm:pt-7 pb-5 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-300/50 dark:border-violet-500/30 text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                      {project.stats && project.stats.length > 0 ? 'Full-Stack System' : 'AI System'}
                    </span>
                    <span className="font-mono text-xs text-navy-300 dark:text-gray-500 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-ink dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-500 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400 transition-all">
                    {project.title}
                  </h3>
                  <p className="text-sm text-navy-500 dark:text-gray-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Card body: key points */}
                <div className="px-6 sm:px-7 py-5 flex-grow">
                  <ul className="space-y-2.5 mb-5">
                    {project.points.slice(0, 3).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-navy-500 dark:text-gray-400">
                        <span className="mt-[7px] w-1 h-1 rounded-full bg-accent dark:bg-violet-400 shrink-0" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md glass-chip text-[11px] font-medium text-navy-500 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer: links */}
                <div className="px-6 sm:px-7 py-4 border-t border-white/60 dark:border-white/10 flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors"
                    >
                      <Github size={14} />
                      Code
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-600 dark:text-violet-400 hover:text-accent dark:hover:text-violet-300 transition-colors"
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
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      API
                    </a>
                  )}
                  {project.detailPath && (
                    <Link
                      to={project.detailPath}
                      className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-ink dark:text-white group/link"
                    >
                      Case study
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
