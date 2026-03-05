
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Calendar, ExternalLink, ChevronDown, CheckCircle2 } from 'lucide-react';
import { EDUCATION, CERTIFICATIONS } from '../constants';

const Education: React.FC = () => {
  const [expandedCertIdx, setExpandedCertIdx] = useState<number | null>(null);

  const toggleCert = (idx: number) => {
    setExpandedCertIdx(expandedCertIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Education Timeline */}
        <div>
          <div className="flex items-center space-x-4 mb-12">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-3xl font-display font-bold">Academic Journey</h2>
          </div>

          <div className="space-y-12">
            {EDUCATION.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l border-white/10"
              >
                <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                <div className="flex items-center space-x-2 text-purple-400 text-sm font-medium mb-2">
                  <Calendar size={14} />
                  <span>{edu.period}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{edu.institution}</h3>
                <p className="text-gray-300 font-medium mb-2">{edu.degree}</p>
                {edu.specialization && (
                  <p className="text-sm text-gray-500">Specialization: {edu.specialization}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center space-x-4 mb-12">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <Award size={32} />
            </div>
            <h2 className="text-3xl font-display font-bold">Certifications</h2>
          </div>

          <div className="grid gap-4">
            {CERTIFICATIONS.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl border bg-white/5 transition-all overflow-hidden ${
                  expandedCertIdx === idx 
                  ? 'border-blue-500/50 bg-white/10 shadow-lg shadow-blue-500/10' 
                  : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div 
                  onClick={() => toggleCert(idx)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      animate={{ rotate: expandedCertIdx === idx ? 180 : 0 }}
                      className="text-blue-500"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                    <div>
                      <span className="text-gray-300 font-medium block group-hover:text-white transition-colors">{cert.name}</span>
                      <span className="text-gray-500 text-xs uppercase tracking-widest">{cert.issuer}</span>
                    </div>
                  </div>
                  
                  {cert.link && (
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500 hover:text-white transition-all self-start sm:self-center"
                    >
                      <ExternalLink size={12} />
                      <span>Verify</span>
                    </a>
                  )}
                </div>

                <AnimatePresence>
                  {expandedCertIdx === idx && cert.learned && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="bg-black/20"
                    >
                      <div className="p-5 pt-0 border-t border-white/5 space-y-4">
                        <div className="mt-4 flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={14} />
                          <span>Core Learning Outcomes</span>
                        </div>
                        <ul className="grid gap-3">
                          {cert.learned.map((point, pIdx) => (
                            <motion.li 
                              key={pIdx}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: pIdx * 0.05 }}
                              className="text-sm text-gray-400 flex items-start space-x-3"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 flex-shrink-0" />
                              <span>{point}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
