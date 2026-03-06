
import React from 'react';
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
import NotFound from './pages/NotFound';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isTerminalOpen, openTerminal, closeTerminal } = useUI();

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
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:permalink" element={<BlogPostPage />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </AdminProvider>
          </BlogProvider>
        </UIProvider>
      </Router>
      <Analytics />
    </HelmetProvider>
  );
};

export default App;
