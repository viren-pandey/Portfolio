
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronRight, Tag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';

const Blog: React.FC = () => {
  const { posts, loading, error, deletePost } = useBlog();

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
          Engineering Blog
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl text-lg">
          Thoughts on AI, Software Architecture, and the future of tech.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="max-w-xl mx-auto text-center py-16 px-6 rounded-2xl border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 font-semibold mb-2">Firebase Error: {error}</p>
          <p className="text-gray-400 text-sm">{errorMessages[error] ?? 'Check browser console (F12) for details.'}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          No posts yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.article
              key={post.id}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
