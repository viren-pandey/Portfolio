import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '/', type: 'route' as const },
  { label: 'About', href: '/#about', type: 'hash' as const },
  { label: 'Work', href: '/#work', type: 'hash' as const },
  { label: 'Projects', href: '/#projects', type: 'hash' as const },
  { label: 'Experience', href: '/#experience', type: 'hash' as const },
  { label: 'Contact', href: '/contact', type: 'route' as const },
];

const GITHUB_URL = 'https://github.com/viren-pandey';
const LINKEDIN_URL = 'https://linkedin.com/in/viren-pandey';

function scrollToHash(hash: string) {
  const id = hash.replace('/#', '');
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (link: (typeof NAV_LINKS)[number]) => {
    if (link.type === 'route') return location.pathname === link.href;
    if (link.type === 'hash' && location.pathname === '/') {
      const id = link.href.replace('/#', '');
      return location.hash === `#${id}`;
    }
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`pointer-events-auto mt-3 sm:mt-4 flex items-center justify-between gap-2 rounded-2xl px-4 sm:px-5 transition-all duration-300 ${
            scrolled ? 'glass-strong h-14 shadow-lift' : 'glass h-14'
          }`}
        >
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-display text-lg font-bold tracking-tight text-ink dark:text-white transition-colors group-hover:text-accent-600 dark:group-hover:text-violet-400">
              Viren
            </span>
            <span className="hidden sm:block w-px h-4 bg-gray-200 dark:bg-white/15" aria-hidden="true" />
            <span className="hidden sm:block text-xs font-medium tracking-wide text-navy-500 dark:text-gray-400">
              Founder · Developer · Builder
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.type === 'hash') {
                    e.preventDefault();
                    scrollToHash(link.href);
                  }
                }}
                aria-current={isActive(link) ? 'page' : undefined}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link)
                    ? 'text-ink dark:text-white'
                    : 'text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 mr-1">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Github size={17} />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <Linkedin size={17} />
              </a>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-ink dark:bg-white text-white dark:text-ink hover:bg-navy-700 dark:hover:bg-gray-200 transition-colors"
            >
              Let's Talk
              <ArrowUpRight size={14} />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2 rounded-lg text-ink dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 mx-4 sm:mx-6 rounded-2xl glass-strong overflow-hidden pointer-events-auto">
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.type === 'hash') {
                    e.preventDefault();
                    scrollToHash(link.href);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2.5 text-[15px] font-medium rounded-lg transition-colors ${
                  isActive(link)
                    ? 'text-ink dark:text-white bg-gray-100 dark:bg-white/5'
                    : 'text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 pt-3 border-t border-gray-200/80 dark:border-white/10 flex items-center gap-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-navy-500 dark:text-gray-400 hover:text-ink dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-ink dark:bg-white text-white dark:text-ink"
              >
                Let's Talk
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
