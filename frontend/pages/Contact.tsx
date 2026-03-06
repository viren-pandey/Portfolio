import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle, ArrowLeft, Mail, User, MessageSquare } from 'lucide-react';

const ACCESS_KEY = '5671fd75-8422-4d8e-859b-ec0e67f6d6db';

type Status = 'idle' | 'loading' | 'success' | 'error';

const Contact: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  // Return to referrer if available, else home
  const from = (location.state as { from?: string })?.from ?? '/';

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const formData = new FormData();
      formData.append('access_key', ACCESS_KEY);
      formData.append('name',    name);
      formData.append('email',   email);
      formData.append('subject', subject || 'Portfolio Contact');
      formData.append('message', message);

      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        // Redirect back after 2.2 s
        setTimeout(() => navigate(from, { replace: true }), 2200);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate(from)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white dark:bg-[#0c0a20] border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

          {/* Success state */}
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Thanks for reaching out. Redirecting you back…
              </p>
              <div className="w-32 h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mt-2">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 2.2, ease: 'linear' }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Mail size={24} className="text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Get in touch</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ideas for improving the blog, want to write a guest post, or just say hi?
                </p>
              </div>

              {/* Error banner */}
              {status === 'error' && (
                <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  <AlertCircle size={15} />
                  Something went wrong — please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + Email row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                      Name
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                    Subject <span className="normal-case font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Wanna become editor , sugestion (JOB)"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 text-sm"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
