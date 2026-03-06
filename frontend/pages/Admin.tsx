
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Tag, Type, AlignLeft, Layout, LogOut, Link, Search, Upload } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import { slugify } from '../contexts/BlogContext';
import { useNavigate } from 'react-router-dom';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, BtnLink, BtnClearFormatting, BtnBulletList, BtnNumberedList, BtnRedo, BtnUndo, Separator } from 'react-simple-wysiwyg';

// ── Text Color Picker ──────────────────────────────────────────────────────
const TEXT_COLORS = [
  '#ffffff', '#e2e8f0', '#94a3b8', '#6b7280',
  '#f87171', '#fb923c', '#fbbf24', '#4ade80',
  '#34d399', '#60a5fa', '#818cf8', '#a78bfa',
  '#f472b6', '#22d3ee', '#facc15', '#f59e0b',
];

const HIGHLIGHT_COLORS = [
  '#fbbf24', '#4ade80', '#60a5fa', '#f472b6',
  '#f87171', '#a78bfa', '#22d3ee', '#fb923c',
  'transparent',
];

const ColorDropdown: React.FC<{
  label: React.ReactNode;
  colors: string[];
  onPick: (c: string) => void;
  activeColor: string;
}> = ({ label, colors, onPick, activeColor }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setOpen((v) => !v); }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3px 7px', cursor: 'pointer', background: 'none', border: 'none', lineHeight: 1 }}
      >
        {label}
        <span style={{ display: 'block', width: 14, height: 3, background: activeColor === 'transparent' ? 'repeating-linear-gradient(45deg,#888 0,#888 2px,transparent 2px,transparent 6px)' : activeColor, borderRadius: 2, marginTop: 2, border: '1px solid rgba(255,255,255,0.2)' }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 9999, background: '#1e1830', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: 8, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onMouseDown={(e) => { e.preventDefault(); onPick(c); setOpen(false); }}
              style={{
                background: c === 'transparent' ? 'repeating-linear-gradient(45deg,#555 0,#555 2px,#222 2px,#222 6px)' : c,
                width: 22, height: 22, borderRadius: 4,
                border: activeColor === c ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </span>
  );
};

const TextColorPicker: React.FC = () => {
  const [color, setColor] = useState('#ffffff');
  const apply = (c: string) => { setColor(c); document.execCommand('foreColor', false, c); };
  return <ColorDropdown label={<span style={{ fontWeight: 700, fontSize: 13 }}>A</span>} colors={TEXT_COLORS} onPick={apply} activeColor={color} />;
};

const HighlightPicker: React.FC = () => {
  const [color, setColor] = useState('transparent');
  const apply = (c: string) => { setColor(c); document.execCommand('hiliteColor', false, c); };
  return <ColorDropdown label={<span style={{ fontWeight: 700, fontSize: 12, padding: '0 3px', borderRadius: 2, background: color === 'transparent' ? 'none' : color, color: '#1a1a2e' }}>H</span>} colors={HIGHLIGHT_COLORS} onPick={apply} activeColor={color} />;
};

const Admin: React.FC = () => {
  const { addPost } = useBlog();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [permalink, setPermalink] = useState('');
  const [permalinkManual, setPermalinkManual] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author] = useState('Viren Pandey');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  // Auto-generate permalink from title unless manually overridden
  useEffect(() => {
    if (!permalinkManual && title) {
      setPermalink(slugify(title));
    }
  }, [title, permalinkManual]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImage(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (url: string) => {
    setImage(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addPost({
      title,
      excerpt,
      content,
      tags: tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== ''),
      image,
      author,
      permalink: permalink || slugify(title),
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      keywords: keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k !== ''),
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
          {/* Title */}
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

          {/* Permalink */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Link size={16} /> Permalink (URL slug)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm shrink-0">/blog/</span>
              <input
                type="text"
                value={permalink}
                onChange={(e) => {
                  setPermalinkManual(true);
                  setPermalink(slugify(e.target.value));
                }}
                className="flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white font-mono text-sm"
                placeholder="auto-generated-from-title"
              />
              {permalinkManual && (
                <button
                  type="button"
                  onClick={() => { setPermalinkManual(false); setPermalink(slugify(title)); }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ImageIcon size={16} /> Cover Image
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {/* File Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload image</span>
                <span className="text-xs text-gray-400">PNG, JPG, GIF, WebP</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </div>
              {/* URL Input */}
              <div className="space-y-2">
                <input
                  type="url"
                  value={typeof image === 'string' && !image.startsWith('data:') ? image : ''}
                  onChange={(e) => handleImageUrl(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm"
                  placeholder="Or paste image URL: https://..."
                />
                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden h-28 bg-black/20">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview('')}
                    />
                    <button
                      type="button"
                      onClick={() => { setImage(''); setImagePreview(''); }}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlignLeft size={16} /> Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white h-24 resize-none"
              placeholder="Short summary shown on blog card..."
              required
            />
          </div>

          {/* Tags */}
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

          {/* SEO Section */}
          <div className="border border-purple-500/20 rounded-2xl p-6 space-y-4 bg-purple-500/5">
            <h2 className="text-sm font-semibold text-purple-500 flex items-center gap-2 uppercase tracking-wider">
              <Search size={16} /> SEO &amp; Meta Settings
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={60}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm"
                placeholder="SEO title (defaults to post title, max 60 chars)..."
              />
              <p className="text-xs text-gray-400">{metaTitle.length}/60 characters</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={160}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white h-20 resize-none text-sm"
                placeholder="Description for search engines (defaults to excerpt, max 160 chars)..."
              />
              <p className="text-xs text-gray-400">{metaDescription.length}/160 characters</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Keywords (comma separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm"
                placeholder="machine learning, react, web development..."
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Layout size={16} /> Content
            </label>
            <style>{`
              #blog-editor-wrap .rsw-ce {
                color: #e2e8f0;
                min-height: 380px;
                font-size: 15px;
                line-height: 1.8;
                padding: 16px 20px;
              }
              #blog-editor-wrap .rsw-ce a { color: #60a5fa; text-decoration: underline; }
              #blog-editor-wrap .rsw-ce h1 { font-size: 1.8em; font-weight: 700; margin: .6em 0 .4em; }
              #blog-editor-wrap .rsw-ce h2 { font-size: 1.4em; font-weight: 600; margin: .6em 0 .3em; }
              #blog-editor-wrap .rsw-ce h3 { font-size: 1.15em; font-weight: 600; margin: .5em 0 .2em; }
              #blog-editor-wrap .rsw-toolbar {
                background: rgba(15, 10, 40, 0.95) !important;
                border-bottom: 1px solid rgba(255,255,255,0.08) !important;
                flex-wrap: wrap;
                gap: 2px;
                padding: 4px 6px;
              }
              #blog-editor-wrap button.rsw-btn { color: #e2e8f0; border-radius: 4px; }
              #blog-editor-wrap button.rsw-btn:hover { background: rgba(167,139,250,0.2); }
              #blog-editor-wrap .rsw-separator { border-color: rgba(255,255,255,0.12); }
            `}</style>
            <div id="blog-editor-wrap" className="dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
              <EditorProvider>
                <Editor
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  containerProps={{ style: { minHeight: '400px', overflowY: 'auto' } }}
                >
                  <Toolbar>
                    <BtnUndo />
                    <BtnRedo />
                    <Separator />
                    <BtnBold />
                    <BtnItalic />
                    <BtnUnderline />
                    <BtnStrikeThrough />
                    <Separator />
                    <TextColorPicker />
                    <HighlightPicker />
                    <Separator />
                    <BtnBulletList />
                    <BtnNumberedList />
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

