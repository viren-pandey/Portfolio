
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';
import { SKILLS, PROJECTS, EDUCATION } from '../constants';

interface AIChatProps {
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Viren's AI assistant. Ask me anything about his projects, skills, or education!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = `
        You are an AI assistant representing Viren Pandey. 
        Viren is a Computer Science Engineer specializing in AI/ML.
        
        His background:
        - Education: ${JSON.stringify(EDUCATION)}
        - Skills: ${JSON.stringify(SKILLS)}
        - Projects: ${JSON.stringify(PROJECTS)}
        
        Keep your answers concise, professional, and helpful. 
        Focus on his technical expertise in Computer Vision, YOLOv8, and Full-Stack development.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: context,
          temperature: 0.7,
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops, something went wrong. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-8 w-[90vw] sm:w-[400px] h-[600px] bg-[#0c0a20] border border-white/10 rounded-3xl shadow-2xl flex flex-col z-[70] overflow-hidden backdrop-blur-2xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold">Viren's AI Assistant</h3>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-purple-500/20 text-purple-400'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Bot size={16} />
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                <Loader2 size={16} className="animate-spin text-purple-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about his projects..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AIChat;
