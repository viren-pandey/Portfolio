import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, User, Bot, Loader2, X } from 'lucide-react';
import { Message } from '../types';
import { SKILLS, PROJECTS, EDUCATION } from '../constants';

interface AIChatProps {
  onClose: () => void;
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const buildFallbackResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.match(/skill|tech|stack|language|framework/)) {
    const cats = SKILLS.map((s: any) => `${s.category}: ${(s.items ?? []).join(', ')}`).join(' | ');
    return `Viren's skills: ${cats}.`;
  }

  if (q.match(/project|built|made|work/)) {
    const list = PROJECTS.map((p: any) => `- ${p.title}: ${p.description}`).join('\n');
    return `Key projects:\n${list}`;
  }

  if (q.match(/education|degree|university|college|study/)) {
    const edu = EDUCATION.map((e: any) => `${e.degree} at ${e.institution} (${e.year})`).join(', ');
    return `Education: ${edu}.`;
  }

  if (q.match(/contact|email|hire|reach/)) {
    return 'You can use the Contact page to reach Viren.';
  }

  return "I can help with Viren's projects, skills, education, and navigation across this portfolio.";
};

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I can answer questions and also navigate for you. Try: 'open blog' or 'go to contact'." },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const navigateToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onClose();
  };

  const detectNavIntent = (query: string): string | null => {
    const q = query.toLowerCase();
    const isNav = /(go|open|take me|navigate|show|scroll)/.test(q);
    if (!isNav) return null;

    if (/\bcontact\b/.test(q)) {
      navigate('/contact');
      onClose();
      return 'Opening Contact page.';
    }

    if (/\bblog\b|\bpost\b|\barticle\b/.test(q)) {
      navigate('/blog');
      onClose();
      return 'Opening Blog page.';
    }

    if (/\bprojects\b|\bproject\b/.test(q)) {
      navigate('/projects');
      onClose();
      return 'Opening Projects page.';
    }

    if (/\bhome\b/.test(q)) {
      navigate('/');
      onClose();
      return 'Going to Home page.';
    }

    if (/\bskills\b/.test(q)) {
      navigateToSection('skills');
      return 'Taking you to Skills section.';
    }

    if (/\beducation\b/.test(q)) {
      navigateToSection('education');
      return 'Taking you to Education section.';
    }

    if (/\bprojects section\b|\bshow projects section\b/.test(q)) {
      navigateToSection('projects');
      return 'Taking you to Projects section.';
    }

    return null;
  };

  const fetchGroqReply = async (history: Message[], userInput: string): Promise<string> => {
    const contextHint = [
      'You are the assistant for Viren Pandey portfolio.',
      'Answer concisely and accurately.',
      'If user asks navigation, suggest exact route among /, /blog, /projects, /contact.',
      'Portfolio focus: AI/ML, full-stack projects, engineering blogs.',
    ].join(' ');

    const payloadMessages: GroqMessage[] = [
      { role: 'system', content: contextHint },
      ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userInput },
    ];

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: payloadMessages }),
    });

    const data = await res.json().catch(() => ({} as Record<string, unknown>));
    if (!res.ok || typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error((data as any).error || 'Chat backend unavailable');
    }

    return data.reply.trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const navReply = detectNavIntent(userMsg);
      if (navReply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: navReply }]);
        return;
      }

      let aiText = '';
      try {
        aiText = await fetchGroqReply(messages, userMsg);
      } catch {
        aiText = buildFallbackResponse(userMsg);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: aiText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-8 w-[90vw] sm:w-[400px] h-[600px] bg-white dark:bg-[#0c0a20] border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col z-[70] overflow-hidden backdrop-blur-2xl"
    >
      <div className="p-4 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Viren's AI Assistant</h3>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Online</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors" aria-label="Close AI chat">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Bot size={16} />
              </div>
              <div className="bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10 p-3 rounded-2xl rounded-tl-none">
                <Loader2 size={16} className="animate-spin text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything or say: open blog"
            className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-500/50 transition-colors text-sm text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AIChat;
