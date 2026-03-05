
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Tag, Type, AlignLeft, Layout, LogOut } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import { useNavigate } from 'react-router-dom';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, BtnLink, BtnClearFormatting, Separator } from 'react-simple-wysiwyg';

const Admin: React.FC = () => {
  const { addPost } = useBlog();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [author] = useState('Viren Pandey');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addPost({
      title,
      excerpt,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      image,
      author
    });

    navigate('/blog');
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#0c0a20] border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Layout className="text-purple-500" />
            Blog CMS Panel
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Author: <span className="text-purple-500 font-medium">{author}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Type size={16} /> Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white"
                placeholder="Enter post title..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon size={16} /> Cover Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlignLeft size={16} /> Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white h-24 resize-none"
              placeholder="Short summary for the card..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Tag size={16} /> Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white"
              placeholder="AI, React, Design..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Layout size={16} /> Content
            </label>
            <div className="bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden text-gray-900 dark:text-white">
              <EditorProvider>
                <Editor 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  containerProps={{ style: { height: '400px', overflowY: 'auto' } }}
                >
                  <Toolbar>
                    <BtnBold />
                    <BtnItalic />
                    <BtnUnderline />
                    <BtnStrikeThrough />
                    <Separator />
                    <BtnLink />
                    <BtnClearFormatting />
                  </Toolbar>
                </Editor>
              </EditorProvider>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-xl flex items-center space-x-2 shadow-lg shadow-purple-500/20"
            >
              <Save size={20} />
              <span>Publish Post</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Admin;
