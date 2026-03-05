
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Mail, MessageSquare, X, Terminal } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AnimatedBackground from './components/AnimatedBackground';
import AIChat from './components/AIChat';
import TerminalModal from './components/TerminalModal';
import { UIProvider, useUI } from './contexts/UIContext';
import { BlogProvider } from './contexts/BlogContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTerminalOpen, openTerminal, closeTerminal, isChatOpen, toggleChat, setChatOpen } = useUI();

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
            © 2024 Viren Pandey. Built with React & Love.
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
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col space-y-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openTerminal}
          className="w-12 h-12 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center backdrop-blur-xl transition-colors shadow-xl"
          title="Open Terminal"
        >
          <Terminal size={20} className="text-gray-600 dark:text-gray-400" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isChatOpen ? <X size={28} className="text-white" /> : <MessageSquare size={28} className="text-white" />}
        </motion.button>
      </div>

      {/* AI Assistant Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <AIChat onClose={() => setChatOpen(false)} />
        )}
      </AnimatePresence>

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
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:permalink" element={<BlogPostPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Layout>
          </BlogProvider>
        </UIProvider>
      </Router>
    </HelmetProvider>
  );
};

export default App;
