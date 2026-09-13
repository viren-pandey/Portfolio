import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ChevronRight, Tag, Trash2, PenLine, X, Send, CheckCircle2, Mail, User, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { useAdmin } from '../contexts/AdminContext';
import { Reveal } from '../components/About';
import AdSenseUnit from '../components/ads/AdSenseUnit';
import AdCodeSlot from '../components/ads/AdCodeSlot';

const ACCESS_KEY = '5671fd75-8422-4d8e-859b-ec0e67f6d6db';
type PopupStatus = 'idle' | 'loading' | 'success' | 'error';

const Blog: React.FC = () => {
  const { posts, loading, error, deletePost, incrementImpressions } = useBlog();
  const { ads, settings } = useAdmin();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  const betweenCodeAds = useMemo(
    () => ads.filter(a => a.active && a.position === 'between_posts' && !!a.adCode?.trim()),
    [ads]
  );
  const betweenImageAds = useMemo(
    () => ads.filter(a => a.active && a.position === 'between_posts' && !a.adCode?.trim()),
    [ads]
  );

  const topCodeAd = useMemo(
    () => ads.find(a => a.active && a.position === 'top_banner' && !!a.adCode?.trim()) ?? null,
    [ads]
  );
  const topImageAd = useMemo(
    () => ads.find(a => a.active && a.position === 'top_banner' && !a.adCode?.trim()) ?? null,
    [ads]
  );

  const adsenseClient = settings.adsenseClient.trim();
  const adsenseBetweenPostsSlot = settings.adsenseBetweenPostsSlot.trim();
  const adsenseTopBlogSlot = settings.adsenseTopBlogSlot.trim();

  const useAdSenseBetweenPosts = settings.adsenseEnabled && !!adsenseClient && !!adsenseBetweenPostsSlot;
  const useAdSenseTopBlog = settings.adsenseEnabled && !!adsenseClient && !!adsenseTopBlogSlot;

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

  // Floating contact popup state
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

  // Featured = most recent post; the rest are "latest"
  const featured = filteredPosts[0] ?? null;
  const latest = useMemo(() => filteredPosts.slice(1), [filteredPosts]);

  const showEmptyBlogLoader = !loading && !error && posts.length === 0 && publishedPosts.length === 0;
  const emptyStateMemes = useMemo(() => ([
    'Coming too soon...',
    'Shit, server is down. Lemme create one.',
    'Ohh shit, here we go again.',
    'Apka swagat hai.',
    'Wanna see the blooogs?',
  ]), []);
  const [emptyMemeIndex, setEmptyMemeIndex] = useState(0);
  const [emptyProgress, setEmptyProgress] = useState(14);

  useEffect(() => {
    if (!showEmptyBlogLoader) return;

    const pickAnotherMeme = () => {
      setEmptyMemeIndex((current) => {
        if (emptyStateMemes.length <= 1) return current;
        let next = current;
        while (next === current) next = Math.floor(Math.random() * emptyStateMemes.length);
        return next;
      });
    };

    pickAnotherMeme();
    setEmptyProgress(14);

    const memeTimer = window.setInterval(pickAnotherMeme, 1900);
    const progressTimer = window.setInterval(() => {
      setEmptyProgress((current) => {
        const bump = Math.floor(Math.random() * 9) + 4;
        const next = current + bump;
        return next >= 96 ? 12 : next;
      });
    }, 900);

    return () => {
      window.clearInterval(memeTimer);
      window.clearInterval(progressTimer);
    };
  }, [showEmptyBlogLoader, emptyStateMemes]);

  const errorMessages: Record<string, string> = {
    'permission-denied':   'Firestore rules are blocking reads. Set: allow read: if true in Firebase Console → Firestore → Rules.',
    'unavailable':         'Firestore is unavailable. Check your internet connection.',
    'not-found':           'Firestore database not found. Go to Firebase Console and create a Firestore database.',
    'failed-precondition': 'Firestore database not created yet. Go to Firebase Console and create a Firestore database.',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <Reveal className="flex flex-col items-center mb-12 sm:mb-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400 mb-3">
          Blog
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-ink dark:text-white mb-4">
          Notes from the build
        </h1>
        <p className="text-navy-500 dark:text-gray-400 text-center max-w-2xl text-base sm:text-lg">
          Thoughts on AI, software architecture, the future of tech, and coding.
        </p>
      </Reveal>

      {/* Top banner ad */}
      {(topCodeAd || useAdSenseTopBlog || topImageAd) && (
        <div className="mb-12 rounded-2xl glass p-4">
          <p className="text-[10px] uppercase tracking-widest text-navy-500 dark:text-gray-400 mb-2">Sponsored</p>
          {topCodeAd ? (
            <AdCodeSlot code={topCodeAd.adCode ?? ''} />
          ) : useAdSenseTopBlog ? (
            <AdSenseUnit enabled={useAdSenseTopBlog} client={adsenseClient} slot={adsenseTopBlogSlot} />
          ) : (
            <a href={topImageAd?.linkUrl} target="_blank" rel="noreferrer sponsored"
              className="block relative overflow-hidden rounded-xl border border-violet-500/20 hover:border-violet-500/50 transition-all group shadow-lg">
              {topImageAd?.imageUrl && (
                <img src={topImageAd.imageUrl} alt={topImageAd.title}
                  className="w-full max-h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }} />
              )}
            </a>
          )}
        </div>
      )}

      {/* Topic pills */}
      {!loading && !error && tagCounts.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12 sm:mb-16">
          <button
            onClick={() => setActiveTag(null)}
            className={[
              'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
              activeTag === null
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-transparent text-white shadow-lg shadow-violet-500/30'
                : 'glass-chip text-navy-500 dark:text-gray-300 hover:text-ink dark:hover:text-white',
            ].join(' ')}
          >
            All
            <span className={[
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
              activeTag === null ? 'bg-white/25 text-white' : 'bg-black/10 dark:bg-white/10 text-navy-500 dark:text-gray-400',
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
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-transparent text-white shadow-lg shadow-violet-500/30'
                  : 'glass-chip text-navy-500 dark:text-gray-300 hover:text-ink dark:hover:text-white',
              ].join(' ')}
            >
              <Tag size={11} />
              {tag}
              <span className={[
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                activeTag === tag ? 'bg-white/25 text-white' : 'bg-black/10 dark:bg-white/10 text-navy-500 dark:text-gray-400',
              ].join(' ')}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="max-w-xl mx-auto text-center py-16 px-6 rounded-2xl border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 font-semibold mb-2">Firebase Error: {error}</p>
          <p className="text-gray-400 text-sm">{errorMessages[error] ?? 'Check browser console (F12) for details.'}</p>
        </div>
      ) : showEmptyBlogLoader ? (
        <div className="py-8">
          <div className="max-w-2xl mx-auto glass rounded-[20px] p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-violet-600 dark:text-violet-400 mb-2">Blog Pipeline</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-ink dark:text-white">Brewing fresh blogs...</h3>
            <p className="text-sm text-navy-500 dark:text-gray-400 mt-2 mb-5">Hold on while I spin up the next post.</p>

            <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500"
                animate={{ width: `${emptyProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </div>

            <div className="mt-5 min-h-[30px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={emptyMemeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-sm sm:text-base font-semibold text-violet-600 dark:text-violet-300"
                >
                  {emptyStateMemes[emptyMemeIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <Reveal className="mb-12 sm:mb-16">
              <Link to={`/blog/${featured.permalink}`} className="group block">
                <article className="glass glass-hover-lift rounded-[20px] overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    {/* Featured visual / panel */}
                    <div className="relative min-h-[220px] md:min-h-[300px] bg-gradient-to-br from-violet-600/90 via-fuchsia-600/80 to-blue-600/90 overflow-hidden">
                      {featured.image ? (
                        <img
                          src={featured.image}
                          alt={featured.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-ink text-[11px] font-bold uppercase tracking-wider shadow-card">
                          <Sparkles size={11} className="text-violet-600" />
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Featured content */}
                    <div className="p-6 sm:p-9 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 text-xs text-navy-500 dark:text-gray-400 font-medium">
                        <span className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wider">
                          {featured.tags[0] ?? 'Article'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <span className="inline-flex items-center gap-1"><Clock size={11} /> {featured.readTime}</span>
                        <span className="inline-flex items-center gap-1"><Calendar size={11} /> {featured.date}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-tight text-ink dark:text-white mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-500 dark:group-hover:from-violet-400 dark:group-hover:to-fuchsia-400 transition-all">
                        {featured.title}
                      </h2>
                      <p className="text-sm sm:text-[15px] text-navy-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-5">
                        {featured.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400">
                        Read article
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          )}

          {/* Latest articles */}
          {latest.length > 0 && (
            <Reveal className="mb-6">
              <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-ink dark:text-white">
                Latest articles
              </h2>
            </Reveal>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {latest.map((post, idx) => {
              const shouldShowBetweenAd = (idx + 1) % 6 === 0;
              const codeAdAfterThis = shouldShowBetweenAd && betweenCodeAds.length > 0
                ? betweenCodeAds[Math.floor(idx / 6) % betweenCodeAds.length]
                : null;
              const adAfterThis = !codeAdAfterThis && !useAdSenseBetweenPosts && shouldShowBetweenAd && betweenImageAds.length > 0
                ? betweenImageAds[Math.floor(idx / 6) % betweenImageAds.length]
                : null;
              return (<React.Fragment key={post.id}>
              <motion.article
                ref={(el) => observeCard(el, post.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 3) * 0.08 }}
                className="glass glass-hover-lift group relative rounded-[20px] overflow-hidden flex flex-col"
              >
                {post.image && (
                  <Link to={`/blog/${post.permalink}`} className="block h-40 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </Link>
                )}

                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-xs text-navy-500 dark:text-gray-400 font-medium">
                      <span className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 font-semibold uppercase tracking-wider">
                        {post.tags[0] ?? 'Article'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="inline-flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
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
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-ink dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-snug break-words">
                      {post.title}
                    </h3>
                    <p className="text-navy-500 dark:text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/60 dark:border-white/10">
                    <span className="inline-flex items-center gap-1 text-[11px] text-navy-300 dark:text-gray-500">
                      <Calendar size={10} />
                      {post.date}
                    </span>
                    <Link
                      to={`/blog/${post.permalink}`}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-violet-600 dark:text-violet-400 group/arrow"
                    >
                      Read
                      <ArrowRight size={13} className="transition-transform group-hover/arrow:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
              {shouldShowBetweenAd && codeAdAfterThis && (
                <div className="sm:col-span-2 lg:col-span-3 rounded-2xl glass p-4">
                  <p className="text-[10px] uppercase tracking-widest text-navy-500 dark:text-gray-400 mb-2">Sponsored</p>
                  <AdCodeSlot code={codeAdAfterThis.adCode ?? ''} />
                </div>
              )}
              {shouldShowBetweenAd && !codeAdAfterThis && useAdSenseBetweenPosts && (
                <div className="sm:col-span-2 lg:col-span-3 rounded-2xl glass p-4">
                  <p className="text-[10px] uppercase tracking-widest text-navy-500 dark:text-gray-400 mb-2">Sponsored</p>
                  <AdSenseUnit enabled={useAdSenseBetweenPosts} client={adsenseClient} slot={adsenseBetweenPostsSlot} />
                </div>
              )}
              {adAfterThis && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <a href={adAfterThis.linkUrl} target="_blank" rel="noreferrer sponsored"
                    className="block relative overflow-hidden rounded-2xl border border-violet-500/20 hover:border-violet-500/50 transition-all group shadow-lg">
                    <img src={adAfterThis.imageUrl} alt={adAfterThis.title}
                      className="w-full max-h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }} />
                    <div className="absolute top-2 right-3 text-[10px] font-semibold bg-black/50 text-white/70 px-2 py-0.5 rounded-full backdrop-blur-sm">Sponsored</div>
                  </a>
                </div>
              )}
            </React.Fragment>);
            })}
          </div>

          {/* Newsletter / write-for-us block */}
          {publishedPosts.length > 0 && (
            <Reveal className="mt-14 sm:mt-20">
              <div className="glass-dark rounded-[24px] px-6 sm:px-12 py-12 text-center">
                <div className="flex justify-center mb-5">
                  <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-violet-200">
                    <Mail size={22} />
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-3">
                  Get practical dev guides, weekly
                </h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto mb-7">
                  One email a week with AI, web, and systems engineering notes that actually help. No spam, unsubscribe anytime.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setPopupOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-shadow"
                  >
                    <PenLine size={15} />
                    Write for us
                  </button>
                  <button
                    onClick={() => navigate('/contact', { state: { from: location.pathname } })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/15 text-sm font-semibold rounded-xl hover:bg-white/15 transition-colors"
                  >
                    <Mail size={15} />
                    Get in touch
                  </button>
                </div>
              </div>
            </Reveal>
          )}
        </>
      )}

      {/* Floating contact button + mini popup */}
      <div className="fixed bottom-36 right-8 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {popupOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 glass-strong rounded-2xl overflow-hidden"
            >
              {pStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center px-5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 size={26} className="text-emerald-500" />
                  </div>
                  <p className="font-bold text-ink dark:text-white text-sm">Message sent!</p>
                  <p className="text-xs text-navy-500 dark:text-gray-400">Thanks, I'll get back to you soon.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/60 dark:border-white/10">
                    <div>
                      <p className="font-bold text-ink dark:text-white text-sm">Write for us / Feedback</p>
                      <p className="text-[11px] text-navy-500 dark:text-gray-400">Got ideas or want to contribute?</p>
                    </div>
                    <button onClick={() => setPopupOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handlePopupSubmit} className="px-4 py-4 space-y-3">
                    {pStatus === 'error' && (
                      <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">Something went wrong, try again.</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <User size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input required type="text" value={pName} onChange={e => setPName(e.target.value)} placeholder="Name"
                          className="w-full pl-7 pr-2 py-2 rounded-xl text-xs bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 text-ink dark:text-white placeholder-gray-400 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition-all" />
                      </div>
                      <div className="relative">
                        <Mail size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input required type="email" value={pEmail} onChange={e => setPEmail(e.target.value)} placeholder="Email"
                          className="w-full pl-7 pr-2 py-2 rounded-xl text-xs bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 text-ink dark:text-white placeholder-gray-400 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition-all" />
                      </div>
                    </div>
                    <div className="relative">
                      <MessageSquare size={12} className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none" />
                      <textarea required rows={3} value={pMessage} onChange={e => setPMessage(e.target.value)} placeholder="Your idea, suggestion, or topic you'd like to write about…"
                        className="w-full pl-7 pr-2 py-2 rounded-xl text-xs bg-white/60 dark:bg-white/5 border border-white/70 dark:border-white/10 text-ink dark:text-white placeholder-gray-400 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition-all resize-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="submit" disabled={pStatus === 'loading'}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 disabled:opacity-60 text-white text-xs font-semibold py-2 rounded-xl shadow-lg shadow-violet-500/25 transition-all">
                        {pStatus === 'loading' ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Send size={12} />}
                        {pStatus === 'loading' ? 'Sending…' : 'Send'}
                      </button>
                      <button type="button" onClick={() => navigate('/contact', { state: { from: location.pathname } })}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-navy-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 glass-chip transition-all">
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
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-fuchsia-500/30 text-white relative overflow-hidden group"
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
