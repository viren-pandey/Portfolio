
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Sun, Moon, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const name = "Viren Pandey";

  const letterVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-[#030014]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 py-4 shadow-sm dark:shadow-none' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer group">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="flex items-center"
          >
            {name.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="text-xl font-display font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-500 transition-all group-hover:w-full" />
          </Link>
          <Link to="/blog" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors relative group">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-500 transition-all group-hover:w-full" />
          </Link>
          <a href="https://virenp.vercel.app/blog/about-me-btech-cse-aiml-student-developer-and-doomscroller" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-500 transition-all group-hover:w-full" />
          </a>
          <Link to="/contact" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-500 transition-all group-hover:w-full" />
          </Link>
          
          <div className="w-px h-4 bg-black/10 dark:bg-white/20" />
          
          <div className="flex space-x-4">
            <a href="https://github.com/viren-pandey" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors transform hover:scale-110">
                <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/viren-pandey" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors transform hover:scale-110">
                <Linkedin size={20} />
            </a>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative overflow-hidden"
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-yellow-500" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
           <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isDark ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-yellow-400" />}
          </motion.button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030014]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white py-2">Home</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white py-2">Blog</Link>
              <a href="https://virenp.vercel.app/blog/about-me-btech-cse-aiml-student-developer-and-doomscroller" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white py-2">About</a>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white py-2">Contact</Link>
              <div className="flex space-x-4 py-2">
                <a href="https://github.com/viren-pandey" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <Github size={20} />
                </a>
                <a href="https://linkedin.com/in/viren-pandey" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <Linkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
