
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Terminal } from 'lucide-react';

interface HeroProps {
  onOpenTerminal: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Sparkles size={14} />
            <span>AI & Machine Learning Engineer</span>
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-display font-bold leading-tight mb-8">
            Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">Future</span> with AI
          </h1>
          
          <p className="text-lg text-gray-400 max-w-lg mb-10 leading-relaxed">
            I'm Viren Pandey, specializing in Computer Vision and Real-Time AI systems. Currently pursuing B.Tech in CSE with a focus on Artificial Intelligence.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToProjects}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center space-x-2 shadow-xl shadow-white/10 transition-shadow"
            >
              <span>View Projects</span>
              <ChevronRight size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenTerminal}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center space-x-2 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <Terminal size={20} />
              <span>Open Terminal</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:block"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-3xl opacity-20 animate-pulse" />
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl flex items-center justify-center">
            {/* Holographic UI Representation */}
            <div className="w-full h-full p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-purple-500/20 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-blue-500/20 rounded-full animate-pulse delay-75" />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-purple-500/40 border-t-purple-500 animate-spin" />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group hover:bg-white/10 transition-colors">
                      <div className="text-purple-400 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Terminal size={32} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
