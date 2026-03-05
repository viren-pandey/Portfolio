
import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ChevronRight } from 'lucide-react';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl font-display font-bold mb-4">Featured Work</h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {PROJECTS.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative rounded-[2rem] overflow-hidden bg-black/40 border border-white/10 p-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                  <Github size={24} />
                </div>
                <div className="flex space-x-3">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                      <Github size={20} />
                    </a>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{project.title}</h3>
              <p className="text-gray-400 mb-6 italic">{project.description}</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {project.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start space-x-2 text-gray-300 text-sm">
                    <ChevronRight size={14} className="mt-1 flex-shrink-0 text-purple-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
