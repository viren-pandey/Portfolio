
import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from '../constants';
// Fixed: Replace non-existent 'Tool' icon with 'Wrench'
import { Code, Cpu, Globe, Wrench } from 'lucide-react';

const Skills: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "Programming Languages": return <Code className="text-purple-400" />;
      case "AI/ML Frameworks": return <Cpu className="text-blue-400" />;
      case "Web Technologies": return <Globe className="text-emerald-400" />;
      // Fixed: Replace 'Tool' with 'Wrench'
      default: return <Wrench className="text-orange-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl font-display font-bold mb-4">Technical Arsenal</h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {SKILLS.map((cat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group"
          >
            <div className="mb-6 p-3 w-fit rounded-2xl bg-white/5 group-hover:bg-purple-500/10 transition-colors">
              {getIcon(cat.category)}
            </div>
            <h3 className="text-xl font-bold mb-4">{cat.category}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill, sIdx) => (
                <span 
                  key={sIdx}
                  className="px-3 py-1 rounded-lg bg-white/5 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Skills;
