
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon, ChevronRight, Briefcase } from 'lucide-react';
import { PROJECTS } from '../constants';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome to Viren Shell v1.0.0',
    'Type "help" to see available commands.',
  ]);
  const [showProjectsBox, setShowProjectsBox] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, `viren@portfolio:~$ ${input}`];

    if (cmd === '/projects' || cmd === 'projects') {
      newHistory.push('Fetching projects summary data...');
      setShowProjectsBox(true);
      setTimeout(() => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }, 1500);
    } else if (cmd === '/skills' || cmd === 'skills') {
      newHistory.push('Navigating to skills...');
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(onClose, 800);
    } else if (cmd === '/education' || cmd === 'education') {
      newHistory.push('Navigating to education...');
      document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(onClose, 800);
    } else if (cmd === 'help') {
      newHistory.push('Available commands:', '  /projects - List projects and scroll', '  /skills   - View technical skills', '  /education- View education history', '  clear     - Clear terminal', '  exit      - Close terminal');
    } else if (cmd === 'clear') {
      setHistory(['Terminal cleared.']);
      setInput('');
      setShowProjectsBox(false);
      return;
    } else if (cmd === 'exit') {
      onClose();
      return;
    } else {
      newHistory.push(`Command not found: ${cmd}. Type "help" for a list of commands.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#0c0a20] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <TerminalIcon size={16} className="text-gray-400" />
            <span className="text-xs font-mono text-gray-400">viren@portfolio: ~</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
              <X size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={containerRef}
          className="h-[400px] overflow-y-auto p-4 font-mono text-sm space-y-1 custom-scrollbar"
        >
          {history.map((line, i) => (
            <div key={i} className={line.startsWith('viren@portfolio') ? 'text-purple-400' : 'text-gray-300'}>
              {line}
            </div>
          ))}

          <AnimatePresence>
            {showProjectsBox && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 overflow-hidden"
              >
                <div className="flex items-center space-x-2 text-purple-400 mb-3">
                  <Briefcase size={16} />
                  <span className="font-bold">Active Projects</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROJECTS.map((p, i) => (
                    <div key={i} className="p-2 rounded bg-white/5 text-xs">
                      <div className="text-white font-bold">{p.title}</div>
                      <div className="text-gray-400 text-[10px]">{p.tags.join(', ')}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[10px] text-gray-500 animate-pulse">
                  Redirecting to full projects section...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleCommand} className="flex items-center pt-2">
            <span className="text-green-400 mr-2">viren@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow bg-transparent border-none outline-none text-white p-0 m-0"
              autoFocus
            />
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TerminalModal;
