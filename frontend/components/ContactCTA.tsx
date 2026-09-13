import React from 'react';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from './About';

const ContactCTA: React.FC = () => {
  return (
    <section id="contact" className="px-4 sm:px-6 py-16 sm:py-24">
      <Reveal className="max-w-6xl mx-auto">
        <div className="glass-dark rounded-[24px] px-6 sm:px-12 py-14 sm:py-16 text-center">
          {/* subtle inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(600px 240px at 50% 0%, rgba(124,58,237,0.18), transparent 70%)',
            }}
          />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 mb-4">
              Contact
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white leading-tight mb-4 max-w-xl mx-auto">
              Have an idea worth building?
            </h2>
            <p className="text-base text-gray-400 leading-relaxed max-w-lg mx-auto mb-9">
              Whether you want to discuss a product, collaboration, software project, or a technical
              challenge, feel free to get in touch.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-shadow"
              >
                <Mail size={16} />
                Contact Me
              </Link>
              <a
                href="mailto:pandeyviren78@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/15 text-sm font-semibold rounded-xl hover:bg-white/15 transition-colors"
              >
                Email directly
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-8 border-t border-white/10">
              <a
                href="https://github.com/viren-pandey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Github size={15} />
                GitHub
                <ArrowUpRight size={13} />
              </a>
              <a
                href="https://linkedin.com/in/viren-pandey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={15} />
                LinkedIn
                <ArrowUpRight size={13} />
              </a>
              <a
                href="mailto:pandeyviren78@gmail.com"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={15} />
                pandeyviren78@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default ContactCTA;
