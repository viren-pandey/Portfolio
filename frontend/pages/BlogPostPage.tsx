import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';

const BlogPostPage: React.FC = () => {
  const { permalink } = useParams<{ permalink: string }>();
  const { getPostByPermalink } = useBlog();
  const navigate = useNavigate();

  const post = permalink ? getPostByPermalink(permalink) : undefined;

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

      <article className="max-w-4xl mx-auto px-6 py-32">
        {/* Back link */}
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
          .blog-content figure { text-align: center; margin: 1.5em auto; }
          .blog-content figure img { max-width: 100%; height: auto; display: inline-block; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.15); }
          .blog-content figcaption { font-size: 0.85em; color: #6b7280; margin-top: 8px; font-style: italic; }
          .blog-content pre { border-radius: 10px; overflow-x: auto; }
          .blog-content pre code { font-family: 'Fira Code', Consolas, monospace; font-size: inherit; }
          /* Light mode: override inline dark code-block styles from editor */
          html:not(.dark) .blog-content pre { background: #f1f5f9 !important; border: 1px solid rgba(0,0,0,0.08) !important; }
          html:not(.dark) .blog-content pre code { color: #6d28d9 !important; }
          /* Dark mode figcaption */
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
            prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10
            prose-img:rounded-2xl prose-img:shadow-xl
            prose-blockquote:border-purple-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
};

export default BlogPostPage;
