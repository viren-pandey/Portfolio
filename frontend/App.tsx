
import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { Mail, Terminal } from 'lucide-react';
import Navbar from './components/Navbar';
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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTerminalOpen, openTerminal, closeTerminal } = useUI();
  const seenIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    // Request browser notification permission from blog visitors
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // Listen for new notifications pushed by admin via Firestore
    try {
      const q = query(collection(db, 'notifications'), orderBy('_sentAt', 'desc'));
      const unsub = onSnapshot(q, snap => {
        const ids = snap.docs.map(d => d.id);
        if (seenIds.current === null) {
          // First snapshot — record existing IDs, don't show them
          seenIds.current = new Set(ids);
          return;
        }
        for (const d of snap.docs) {
          if (!seenIds.current.has(d.id)) {
            seenIds.current.add(d.id);
            const data = d.data() as { title: string; body: string; url?: string };
            if (Notification.permission === 'granted') {
              const notif = new Notification(data.title, { body: data.body, icon: '/favicon.ico' });
              if (data.url) notif.onclick = () => window.open(data.url, '_blank');
            }
          }
        }
      }, err => console.warn('notifications listener:', err.code));
      return () => unsub();
    } catch { return; }
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#030014] text-gray-900 dark:text-white selection:bg-purple-500/30 transition-colors duration-300">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-black/10 dark:border-white/10 bg-gray-50 dark:bg-[#030014] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-gray-500 text-sm">
            © March 2026 Viren Pandey. Built with React & Love.
          </div>
          <div className="flex space-x-6">
            <a href="mailto:pandeyviren78@gmail.com" className="text-gray-400 hover:text-purple-400 flex items-center space-x-2 transition-colors">
              <Mail size={16} />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 z-[60]">
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

      {/* Terminal Overlay */}
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
                {/* Standalone full-screen routes — no navbar/footer */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                {/* Portfolio routes — wrapped with Navbar & footer */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/blog/:permalink" element={<Layout><BlogPostPage /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
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
