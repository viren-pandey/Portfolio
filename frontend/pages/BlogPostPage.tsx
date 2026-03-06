import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, Tag, ArrowLeft, User, List } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';

// ── Types ──────────────────────────────────────────────────────────────────
interface Heading { level: number; text: string; id: string; }

// ── Inject anchor IDs into heading tags, return processed HTML + heading list
function extractAndInjectHeadings(html: string): { processedHtml: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const usedSlugs = new Map<string, number>();

  const processedHtml = html.replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, lvl, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    let slug = text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 72) || `heading-${headings.length}`;
    const n = usedSlugs.get(slug) ?? 0;
    usedSlugs.set(slug, n + 1);
    const finalId = n > 0 ? `${slug}-${n}` : slug;
    headings.push({ level: Number(lvl), text, id: finalId });
    return `<h${lvl}${attrs} id="${finalId}">${inner}</h${lvl}>`;
  });

  return { processedHtml, headings };
}

// ── Table of Contents ──────────────────────────────────────────────────────
const TableOfContents: React.FC<{ headings: Heading[] }> = ({ headings }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  };

  if (!headings.length) return null;

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center gap-2">
        <List size={13} className="text-purple-500" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          On this page
        </span>
      </div>

      {/* Nav items */}
      <nav className="p-2.5 space-y-0.5 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {headings.map((h) => (
          <button
            key={h.id}
            onClick={() => scrollTo(h.id)}
            title={h.text}
            className={[
              'w-full text-left rounded-lg py-1.5 leading-snug transition-all duration-150',
              h.level === 1 ? 'px-3 text-[13px] font-semibold' : '',
              h.level === 2 ? 'pl-6 pr-3 text-[12px] font-medium' : '',
              h.level === 3 ? 'pl-9 pr-3 text-[11px]' : '',
              activeId === h.id
                ? 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-l-2 border-purple-500 pl-[10px]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5',
            ].join(' ')}
          >
            <span className="line-clamp-2">{h.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const BlogPostPage: React.FC = () => {
  const { permalink } = useParams<{ permalink: string }>();
  const { getPostByPermalink } = useBlog();
  const navigate = useNavigate();

  const post = permalink ? getPostByPermalink(permalink) : undefined;
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract headings & inject IDs once per post
  const { processedHtml, headings } = useMemo(() => {
    if (!post?.content) return { processedHtml: '', headings: [] };
    return extractAndInjectHeadings(post.content);
  }, [post?.content]);

  // Inject copy buttons into every <pre> block after content renders
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const pres = el.querySelectorAll<HTMLPreElement>('pre:not([data-copy-injected])');
    pres.forEach((pre) => {
      pre.setAttribute('data-copy-injected', '1');
      pre.style.position = 'relative';

      const btn = document.createElement('button');
      btn.setAttribute('class', 'code-copy-btn');
      btn.setAttribute('title', 'Copy code');
      btn.innerHTML = `<span class="copy-icon">⧉</span><span class="copy-label">Copy</span>`;

      btn.onclick = async () => {
        const text = (pre.querySelector('code') ?? pre).innerText;
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = `<span class="copy-icon">✓</span><span class="copy-label">Copied!</span>`;
          btn.classList.add('copied');
          setTimeout(() => {
            btn.innerHTML = `<span class="copy-icon">⧉</span><span class="copy-label">Copy</span>`;
            btn.classList.remove('copied');
          }, 2000);
        } catch {/* clipboard denied */}
      };
      pre.appendChild(btn);
    });
  }, [processedHtml]);

  useEffect(() => {
    if (permalink && !post) {
      // Post not found — redirect after brief delay
      const t = setTimeout(() => navigate('/blog'), 2000);
      return () => clearTimeout(t);
    }
  }, [post, permalink, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-2xl font-bold text-gray-400 mb-2">Post not found</p>
          <p className="text-gray-500 text-sm">Redirecting to blog…</p>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://virenpandey.dev/blog/${post.permalink}`;
  const resolvedMetaTitle = post.metaTitle || post.title;
  const resolvedMetaDesc = post.metaDescription || post.excerpt;
  const resolvedKeywords = post.keywords?.join(', ') || post.tags.join(', ');

  return (
    <>
      <Helmet>
        <title>{resolvedMetaTitle} | Viren Pandey</title>
        <meta name="description" content={resolvedMetaDesc} />
        {resolvedKeywords && <meta name="keywords" content={resolvedKeywords} />}
        <meta name="author" content={post.author} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={resolvedMetaTitle} />
        <meta property="og:description" content={resolvedMetaDesc} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Viren Pandey" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={resolvedMetaTitle} />
        <meta name="twitter:description" content={resolvedMetaDesc} />
        {post.image && <meta name="twitter:image" content={post.image} />}

        {/* Article structured data */}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-32">
        {/* Back link — full width */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </motion.div>

        {/* Two-column: invisible left spacer + article (centered) + TOC sidebar */}
        <div className="flex gap-10 items-start">

          {/* Left spacer — mirrors TOC width so article stays centered */}
          <div className="hidden xl:block w-64 flex-shrink-0" />

          {/* ── Article ── */}
          <article className="flex-1 min-w-0 max-w-3xl mx-auto">

        {/* Hero image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl overflow-hidden mb-10 max-h-[480px]"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        )}

        {/* Post header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium border border-purple-500/20 flex items-center gap-1"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pb-8 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <User size={15} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </motion.header>

        {/* Post content */}
        <style>{`
          /* ── Code block box ─────────────────────────────────────── */
          .blog-content pre {
            position: relative;
            border-radius: 12px;
            overflow-x: auto;
            margin: 1.5em 0;
            padding: 20px 20px 16px;
            font-size: 14px;
            line-height: 1.7;
            border: 1.5px solid rgba(108,99,255,0.25);
            box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          }
          .blog-content pre code {
            font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
            font-size: inherit;
            background: none;
            padding: 0;
          }
          /* ── Copy button ─────────────────────────────────────────── */
          .code-copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            background: rgba(108,99,255,0.15);
            border: 1px solid rgba(108,99,255,0.3);
            color: #a78bfa;
            transition: all 0.15s;
            z-index: 10;
          }
          .code-copy-btn:hover { background: rgba(108,99,255,0.3); color: #c4baff; }
          .code-copy-btn.copied { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.4); color: #4ade80; }
          /* ── Figures ─────────────────────────────────────────────── */
          .blog-content figure { text-align: center; margin: 1.5em auto; }
          .blog-content figure img { max-width: 100%; height: auto; display: inline-block; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15); }
          .blog-content figcaption { font-size: 0.85em; color: #6b7280; margin-top: 8px; font-style: italic; }
          /* ── Light mode overrides ────────────────────────────────── */
          html:not(.dark) .blog-content span[style],
          html:not(.dark) .blog-content font { color: inherit !important; }
          html:not(.dark) .blog-content { color: #111827; }
          html:not(.dark) .blog-content pre { background: #f8f7ff !important; border-color: rgba(108,99,255,0.2) !important; }
          html:not(.dark) .blog-content pre code { color: #4c1d95 !important; }
          /* ── Dark mode ───────────────────────────────────────────── */
          html.dark .blog-content { color: #e2e8f0; }
          html.dark .blog-content pre { background: #0d0b1f !important; }
          html.dark .blog-content pre code { color: #c4b5fd !important; }
          html.dark .blog-content figcaption { color: #9ca3af; }
        `}</style>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="blog-content prose prose-lg prose-gray dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-code:text-purple-600 dark:prose-code:text-purple-400
            prose-pre:!p-0 prose-pre:!bg-transparent prose-pre:!border-0 prose-pre:!shadow-none
            prose-img:rounded-2xl prose-img:shadow-xl
            prose-blockquote:border-purple-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          "
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
          </article>

          {/* ── Sticky TOC sidebar (xl+) ── */}
          <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-28 self-start">
            <TableOfContents headings={headings} />
          </aside>

        </div>{/* end two-column */}
      </div>
    </>
  );
};

export default BlogPostPage;
