import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const MSGS = [
  { title: 'Oops, page vanished!', sub: "The page you're looking for doesn't exist or was moved." },
  { title: 'Quantum page collapse!', sub: 'This page exists in a parallel universe. Try going home.' },
  { title: 'Page went on vacation.', sub: "It didn't tell us where. Try navigating from home." },
  { title: 'Nothing to see here.', sub: 'Either you mistyped the URL or this page no longer exists.' },
  { title: 'rm -rf page.tsx 💀', sub: 'A developer made a mistake. Or maybe you did. Who knows.' },
  { title: 'Lost in the void.', sub: 'Deep space navigation failure. Returning to base.' },
  { title: 'Page.exe has stopped.', sub: 'Windows is looking for a solution… just kidding, use the button below.' },
];

const NotFound: React.FC = () => {
  const msg = useMemo(() => MSGS[Math.floor(Math.random() * MSGS.length)], []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-[8rem] md:text-[10rem] leading-none font-black mb-4 select-none
            bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-indigo-400 to-cyan-400"
        >
          404
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {msg.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed text-base">
          {msg.sub}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
              bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm
              shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all"
          >
            <Home size={16} />
            Back Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
              border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300
              font-semibold text-sm hover:border-purple-500/50 hover:text-purple-500
              dark:hover:text-purple-400 transition-all"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
