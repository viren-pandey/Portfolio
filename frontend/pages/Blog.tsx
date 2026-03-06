
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ChevronRight, Tag, Trash2, PenLine, X, Send, CheckCircle2, Mail, User, MessageSquare, Eye, BarChart2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { useAdmin } from '../contexts/AdminContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ACCESS_KEY = '5671fd75-8422-4d8e-859b-ec0e67f6d6db';
type PopupStatus = 'idle' | 'loading' | 'success' | 'error';

const Blog: React.FC = () => {
  const { posts, loading, error, deletePost, incrementImpressions } = useBlog();
  const { ads } = useAdmin();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const initialLoad = useRef(true);

  // Push notification subscription
  useEffect(() => {
    if (!('Notification' in window)) return;
    Notification.requestPermission();
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      if (initialLoad.current) {
        snap.docs.forEach(doc => sessionStorage.setItem(`notif_seen_${doc.id}`, '1'));
        initialLoad.current = false;
        return;
      }
      snap.docChanges().forEach(change => {
        if (change.type !== 'added') return;
        const key = `notif_seen_${change.doc.id}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
        if (Notification.permission === 'granted') {
          const n = change.doc.data();
          const notif = new Notification(n.title, { body: n.body, icon: '/favicon.ico' });
          if (n.url) notif.onclick = () => window.open(n.url, '_blank');
        }
      });
    }, () => {});
    return unsub;
  }, []);

  const betweenAds = useMemo(() => ads.filter(a => a.active && a.position === 'between_posts'), [ads]);

  // Track impressions: fire once per session when a card enters the viewport
  const impressionObserver = useRef<IntersectionObserver | null>(null);
  const observeCard = useCallback((el: HTMLElement | null, postId: string) => {
    if (!el) return;
    const key = `impression_${postId}`;
    if (sessionStorage.getItem(key)) return;
    if (!impressionObserver.current) {
      impressionObserver.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = (entry.target as HTMLElement).dataset.postId;
            if (!id) return;
            const k = `impression_${id}`;
            if (sessionStorage.getItem(k)) return;
            sessionStorage.setItem(k, '1');
            incrementImpressions(id);
            impressionObserver.current?.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
    }
    el.dataset.postId = postId;
    impressionObserver.current.observe(el);
  }, [incrementImpressions]);

  // ── Floating contact popup state ──
  const [popupOpen, setPopupOpen]   = useState(false);
  const [pName,     setPName]       = useState('');
  const [pEmail,    setPEmail]      = useState('');
  const [pMessage,  setPMessage]    = useState('');
  const [pStatus,   setPStatus]     = useState<PopupStatus>('idle');

  const handlePopupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPStatus('loading');
    try {
      const fd = new FormData();
      fd.append('access_key', ACCESS_KEY);
      fd.append('name',    pName);
      fd.append('email',   pEmail);
      fd.append('subject', 'Blog Feedback / Write for us');
      fd.append('message', pMessage);
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const data = await res.json();
      setPStatus(data.success ? 'success' : 'error');
      if (data.success) setTimeout(() => { setPopupOpen(false); setPStatus('idle'); setPName(''); setPEmail(''); setPMessage(''); }, 2200);
    } catch { setPStatus('error'); }
  };

  // Only published posts for public view
  const publishedPosts = useMemo(() => posts.filter(p => (p.status ?? 'published') === 'published'), [posts]);

  // Unique tags with post counts, sorted by frequency
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    publishedPosts.forEach(p => p.tags.forEach(t => map.set(t, (map.get(t) ?? 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [publishedPosts]);

  const filteredPosts = useMemo(
    () => {
      return activeTag ? publishedPosts.filter(p => p.tags.includes(activeTag)) : publishedPosts;
    },
    [publishedPosts, activeTag]
  );

  const errorMessages: Record<string, string> = {
    'permission-denied':   'Firestore rules are blocking reads. Set: allow read: if true in Firebase Console → Firestore → Rules.',
    'unavailable':         'Firestore is unavailable. Check your internet connection.',
    'not-found':           'Firestore database not found. Go to Firebase Console and create a Firestore database.',
    'failed-precondition': 'Firestore database not created yet. Go to Firebase Console and create a Firestore database.',
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-16"
      >
        <h2 className="text-5xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Engineering Blogs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl text-lg">
          Thoughts on AI, Software Architecture, the future of tech and Coding.
        </p>
      </motion.div>

      {/* Tag filter pills */}
      {!loading && !error && tagCounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {/* "All" pill */}
          <button
            onClick={() => setActiveTag(null)}
            className={[
              'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
              activeTag === null
                ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400',
            ].join(' ')}
          >
            All
            <span className={[
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
              activeTag === null ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400',
            ].join(' ')}>
              {publishedPosts.length}
            </span>
          </button>

          {tagCounts.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setActiveTag(prev => prev === tag ? null : tag)}
              className={[
                'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                activeTag === tag
                  ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400',
              ].join(' ')}
            >
              <Tag size={11} />
              {tag}
              <span className={[
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                activeTag === tag ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400',
              ].join(' ')}>
                {count}
              </span>
            </button>
          ))}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="max-w-xl mx-auto text-center py-16 px-6 rounded-2xl border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 font-semibold mb-2">Firebase Error: {error}</p>
          <p className="text-gray-400 text-sm">{errorMessages[error] ?? 'Check browser console (F12) for details.'}</p>
        </div>
      ) : posts.length === 0 && publishedPosts.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          No posts yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => {
            const adAfterThis = (idx + 1) % 3 === 0 && betweenAds.length > 0
              ? betweenAds[Math.floor(idx / 3) % betweenAds.length]
              : null;
            return (<React.Fragment key={post.id}>
            <motion.article
              key={post.id}
              ref={(el) => observeCard(el, post.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {post.image && (
                <Link to={`/blog/${post.permalink}`} className="block h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </Link>
              )}

              <div className="p-8 relative z-10 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={12} />
                      <span>{(post.views ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); deletePost(post.id); }}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Post"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <Link to={`/blog/${post.permalink}`} className="block flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5 dark:border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 text-[10px] text-gray-600 dark:text-gray-300 border border-black/5 dark:border-white/5 flex items-center">
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.permalink}`}
                    className="p-2 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-purple-500 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]"
                    aria-label={`Read ${post.title}`}
                  >
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.article>
              {adAfterThis && (
                <motion.div
                  key={`ad-after-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.2 }}
                  className="md:col-span-2 lg:col-span-3"
                >
                  <a href={adAfterThis.linkUrl} target="_blank" rel="noreferrer sponsored"
                    className="block relative overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all group shadow-lg">
                    <img src={adAfterThis.imageUrl} alt={adAfterThis.title}
                      className="w-full max-h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }} />
                    <div className="absolute top-2 right-3 text-[10px] font-semibold bg-black/50 text-white/70 px-2 py-0.5 rounded-full backdrop-blur-sm">Sponsored</div>
                  </a>
                </motion.div>
              )}
            </React.Fragment>);
          })}
        </div>
      )}
      {/* ── Floating contact button + mini popup ── */}
      <div className="fixed bottom-36 right-8 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {popupOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 bg-white dark:bg-[#0d0b22] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Accent */}
              <div className="h-0.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

              {pStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center px-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 size={26} className="text-emerald-500" />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Message sent!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Thanks — I'll get back to you soon.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-black/5 dark:border-white/5">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Write for us / Feedback</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Got ideas or want to contribute?</p>
                    </div>
                    <button onClick={() => setPopupOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handlePopupSubmit} className="px-4 py-4 space-y-3">
                    {pStatus === 'error' && (
                      <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">Something went wrong — try again.</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input required type="text" value={pName} onChange={e => setPName(e.target.value)} placeholder="Name"
                          className="w-full pl-7 pr-2 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/15 transition-all" />
                      </div>
                      <div className="relative">
                        <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input required type="email" value={pEmail} onChange={e => setPEmail(e.target.value)} placeholder="Email"
                          className="w-full pl-7 pr-2 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/15 transition-all" />
                      </div>
                    </div>
                    <div className="relative">
                      <MessageSquare size={12} className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none" />
                      <textarea required rows={3} value={pMessage} onChange={e => setPMessage(e.target.value)} placeholder="Your idea, suggestion, or topic you'd like to write about…"
                        className="w-full pl-7 pr-2 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/15 transition-all resize-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="submit" disabled={pStatus === 'loading'}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60 text-white text-xs font-semibold py-2 rounded-xl shadow-lg shadow-purple-500/20 transition-all">
                        {pStatus === 'loading' ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send size={12} />}
                        {pStatus === 'loading' ? 'Sending…' : 'Send'}
                      </button>
                      <button type="button" onClick={() => navigate('/contact', { state: { from: location.pathname } })}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 border border-black/10 dark:border-white/10 hover:border-purple-500/40 transition-all">
                        Full form
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger button */}
        <motion.button
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }}
          onClick={() => setPopupOpen(prev => !prev)}
          title="Write for us / Contact"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/30 text-white relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <AnimatePresence mode="wait">
            {popupOpen
              ? <motion.span key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={20} /></motion.span>
              : <motion.span key="pen" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><PenLine size={20} /></motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default Blog;
