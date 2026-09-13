import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { Mail, Github, Linkedin, MessageCircle, Terminal } from 'lucide-react';
import Navbar from './components/Navbar';
import AIChat from './components/AIChat';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Contact from './pages/Contact';
import AnimatedBackground from './components/AnimatedBackground';
import TerminalModal from './components/TerminalModal';
import { UIProvider, useUI } from './contexts/UIContext';
import { BlogProvider } from './contexts/BlogContext';
import { AdminProvider } from './contexts/AdminContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import NotFound from './pages/NotFound';
import SpaceDebrisAIPage from './pages/SpaceDebrisAI';
import SmartCrowdPage from './pages/SmartCrowd';
import DualityAIPage from './pages/DualityAI';
import ProjectsPage from './pages/ProjectsPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTerminalOpen, openTerminal, closeTerminal, isChatOpen, toggleChat, setChatOpen } = useUI();
  const initialized = useRef(false);
  const knownIds = useRef<Set<string>>(new Set());
  const cachedNotifications = useRef<Array<{ id: string; data: { title?: string; body?: string; url?: string } }>>([]);
  const flushLatestUnseenRef = useRef<() => void>(() => {});
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');

  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }
    setNotificationPermission(Notification.permission);

    const seenKey = (id: string) => `portfolio_notif_seen_${id}`;
    const hasSeen = (id: string) => localStorage.getItem(seenKey(id)) === '1';
    const markSeen = (id: string) => localStorage.setItem(seenKey(id), '1');

    const showNotification = async (id: string, data: { title?: string; body?: string; url?: string }) => {
      if (hasSeen(id)) return;
      if (Notification.permission !== 'granted') return;

      const title = data.title?.trim() || 'Portfolio update';
      const options: NotificationOptions = {
        body: data.body?.trim() || '',
        icon: '/favicon.ico',
        data: { url: data.url || '' },
      };

      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          await reg.showNotification(title, options);
          markSeen(id);
          return;
        }
      } catch {
        // Fall back to Notification constructor for browsers where SW showNotification fails.
      }

      try {
        const notif = new Notification(title, options);
        if (data.url) notif.onclick = () => window.open(data.url, '_blank');
        markSeen(id);
      } catch {
        // Ignore notification display errors.
      }
    };

    const flushLatestUnseen = () => {
      const latestUnseen = cachedNotifications.current.find((d) => !hasSeen(d.id));
      if (!latestUnseen) return;
      void showNotification(latestUnseen.id, latestUnseen.data);
    };
    flushLatestUnseenRef.current = flushLatestUnseen;

    const syncPermission = () => setNotificationPermission(Notification.permission);
    document.addEventListener('visibilitychange', syncPermission);

    try {
      const q = query(collection(db, 'notifications'), orderBy('_sentAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          cachedNotifications.current = snap.docs.map((d) => ({
            id: d.id,
            data: d.data() as { title?: string; body?: string; url?: string },
          }));

          if (!initialized.current) {
            flushLatestUnseen();
            knownIds.current = new Set(snap.docs.map((d) => d.id));
            initialized.current = true;
            return;
          }

          for (const change of snap.docChanges()) {
            if (change.type !== 'added') continue;
            const d = change.doc;
            if (knownIds.current.has(d.id)) continue;
            knownIds.current.add(d.id);
            const data = d.data() as { title?: string; body?: string; url?: string };
            void showNotification(d.id, data);
          }

          for (const d of snap.docs) {
            if (!knownIds.current.has(d.id)) knownIds.current.add(d.id);
          }
        },
        (err) => console.warn('notifications listener:', err.code)
      );
      return () => {
        document.removeEventListener('visibilitychange', syncPermission);
        unsub();
      };
    } catch {
      document.removeEventListener('visibilitychange', syncPermission);
      return;
    }
  }, []);

  useEffect(() => {
    if (notificationPermission !== 'granted') return;
    flushLatestUnseenRef.current();
  }, [notificationPermission]);

  return (
    <div className="relative min-h-screen bg-surface dark:bg-[#0b0916] text-ink dark:text-white selection:bg-violet-500/25 transition-colors duration-300">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-16">
        {children}
      </main>

      <footer className="relative z-10 py-10 glass-strong transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
            <span className="font-display text-base font-bold tracking-tight text-ink dark:text-white">Viren</span>
            <span className="hidden sm:block w-px h-3.5 bg-gray-200 dark:bg-white/15" aria-hidden="true" />
            <span className="text-xs text-navy-300 dark:text-gray-500">
              Founder · Developer · Builder
            </span>
          </div>
          <p className="text-xs text-navy-300 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Viren Pandey. Built with React, Tailwind & care.
          </p>
          <div className="flex space-x-5">
            <a href="https://github.com/viren-pandey" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-navy-300 dark:text-gray-500 hover:text-ink dark:hover:text-white transition-colors">
              <Github size={16} />
            </a>
            <a href="https://linkedin.com/in/viren-pandey" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-navy-300 dark:text-gray-500 hover:text-ink dark:hover:text-white transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="mailto:pandeyviren78@gmail.com" aria-label="Email" className="text-navy-300 dark:text-gray-500 hover:text-ink dark:hover:text-white transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className="w-12 h-12 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center backdrop-blur-xl transition-colors shadow-xl"
          title={isChatOpen ? 'Close AI Chat' : 'Open AI Chat'}
        >
          <MessageCircle size={20} className="text-gray-600 dark:text-gray-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openTerminal}
          className="w-12 h-12 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center backdrop-blur-xl transition-colors shadow-xl"
          title="Open Terminal"
        >
          <Terminal size={20} className="text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <AIChat onClose={() => setChatOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTerminalOpen && (
          <TerminalModal isOpen={isTerminalOpen} onClose={closeTerminal} />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <UIProvider>
          <BlogProvider>
            <AdminProvider>
              <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/blog/:permalink" element={<Layout><BlogPostPage /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
                <Route path="/project/space-debris-ai" element={<Layout><SpaceDebrisAIPage /></Layout>} />
                <Route path="/project/smart-crowd" element={<Layout><SmartCrowdPage /></Layout>} />
                <Route path="/project/duality-ai" element={<Layout><DualityAIPage /></Layout>} />
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </AdminProvider>
          </BlogProvider>
        </UIProvider>
      </Router>
      <Analytics />
    </HelmetProvider>
  );
};

export default App;
