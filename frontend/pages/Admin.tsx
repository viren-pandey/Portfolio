
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Tag, Type, AlignLeft, Layout, LogOut, Link, Search, Upload, Pencil, Trash2, FileText, PlusCircle } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import { slugify } from '../contexts/BlogContext';
import type { BlogPost } from '../contexts/BlogContext';
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

// ── Heading / Text-size Picker ─────────────────────────────────────────────
const HEADING_OPTIONS = [
  { label: 'Normal',          tag: 'p',  fs: 13, fw: 400 },
  { label: 'H1 – Title',      tag: 'h1', fs: 20, fw: 700 },
  { label: 'H2 – Heading',    tag: 'h2', fs: 16, fw: 600 },
  { label: 'H3 – Subheading', tag: 'h3', fs: 13, fw: 600 },
];

const HeadingPicker: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        title="Text size / heading"
        onMouseDown={(e) => { e.preventDefault(); setOpen(v => !v); }}
        style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '3px 8px', cursor: 'pointer', background: 'none', border: 'none', color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}
      >
        T<span style={{ fontSize: 8, lineHeight: 1 }}>▼</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 9999, background: '#1e1830', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: 4, minWidth: 170, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          {HEADING_OPTIONS.map(opt => (
            <button
              key={opt.tag}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, opt.tag); setOpen(false); }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: 5, fontSize: opt.fs, fontWeight: opt.fw }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(167,139,250,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </span>
  );
};

// ── Inline Image Inserter ──────────────────────────────────────────────────
const InlineImageButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [width, setWidth] = useState('75');
  const savedRange = useRef<Range | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const insert = () => {
    if (!url) return;
    const caption = alt
      ? `<figcaption style="font-size:0.85em;color:#9ca3af;margin-top:6px;font-style:italic">${alt}</figcaption>`
      : '';
    const html = `<figure style="text-align:center;margin:1.5em 0"><img src="${url}" alt="${alt}" style="width:${width}%;max-width:100%;border-radius:12px;display:inline-block;box-shadow:0 4px 24px rgba(0,0,0,0.4)" />${caption}</figure><p><br></p>`;
    if (savedRange.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    }
    document.execCommand('insertHTML', false, html);
    setOpen(false); setUrl(''); setAlt(''); setWidth('75');
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '5px 8px', borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)',
    color: '#e2e8f0', fontSize: 12, boxSizing: 'border-box', outline: 'none', marginBottom: 6,
  };

  const widthOptions = [['25', 'S'], ['50', 'M'], ['75', 'L'], ['100', 'Full']];

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        title="Insert image into post body"
        onMouseDown={(e) => { e.preventDefault(); saveRange(); setOpen(v => !v); }}
        style={{ display: 'flex', alignItems: 'center', padding: '3px 7px', cursor: 'pointer', background: 'none', border: 'none', color: '#e2e8f0' }}
      >
        <ImageIcon size={14} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 9999, background: '#1e1830', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: 14, width: 280, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <p style={{ color: '#a78bfa', fontSize: 11, fontWeight: 600, marginBottom: 10, marginTop: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Insert Image</p>
          <input type="url" placeholder="Image URL" value={url} onChange={e => setUrl(e.target.value)} style={inp} />
          <input type="text" placeholder="Alt text / caption" value={alt} onChange={e => setAlt(e.target.value)} style={inp} />
          <p style={{ color: '#9ca3af', fontSize: 11, margin: '0 0 5px' }}>Width</p>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {widthOptions.map(item => (
              <button
                key={item[0]}
                type="button"
                onMouseDown={e => { e.preventDefault(); setWidth(item[0]); }}
                style={{ flex: 1, padding: '4px 2px', borderRadius: 5, fontSize: 11, border: '1px solid', borderColor: width === item[0] ? '#7c3aed' : 'rgba(255,255,255,0.15)', background: width === item[0] ? 'rgba(124,58,237,0.3)' : 'none', color: '#e2e8f0', cursor: 'pointer' }}
              >
                {item[1]}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); insert(); }}
              disabled={!url}
              style={{ flex: 1, padding: '6px 0', borderRadius: 6, background: url ? '#7c3aed' : 'rgba(124,58,237,0.3)', color: '#fff', border: 'none', cursor: url ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 600 }}
            >
              Insert
            </button>
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); setOpen(false); }}
              style={{ flex: 1, padding: '6px 0', borderRadius: 6, background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 12 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </span>
  );
};

// ── Code Block Inserter ────────────────────────────────────────────────────
const CodeBlockButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const insert = (fontSize: string) => {
    const html = `<pre style="background:#0d0a1e;border:1px solid rgba(167,139,250,0.25);border-radius:10px;padding:16px 20px;font-size:${fontSize};overflow-x:auto;margin:1em 0;line-height:1.6"><code style="font-family:'Fira Code',Consolas,monospace;color:#c4b5fd">// paste your code here</code></pre><p><br></p>`;
    document.execCommand('insertHTML', false, html);
    setOpen(false);
  };

  const sizes = [['13px', 'Small'], ['15px', 'Normal'], ['17px', 'Large']];

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        title="Insert code block"
        onMouseDown={(e) => { e.preventDefault(); setOpen(v => !v); }}
        style={{ display: 'flex', alignItems: 'center', padding: '3px 8px', cursor: 'pointer', background: 'none', border: 'none', color: '#a78bfa', fontFamily: 'monospace', fontSize: 13, fontWeight: 700 }}
      >
        {'</>'}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 9999, background: '#1e1830', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <p style={{ color: '#9ca3af', fontSize: 11, padding: '2px 8px 5px', margin: 0 }}>Code block size</p>
          {sizes.map(item => (
            <button
              key={item[0]}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insert(item[0]); }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px', background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: 5, fontFamily: 'monospace', fontSize: item[0] }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(167,139,250,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {item[1]}
            </button>
          ))}
        </div>
      )}
    </span>
  );
};

const Admin: React.FC = () => {
  const { addPost, updatePost, deletePost, posts } = useBlog();
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
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPosts, setShowPosts] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

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

  const resetForm = () => {
    setEditingPost(null);
    setTitle('');
    setPermalink('');
    setPermalinkManual(false);
    setExcerpt('');
    setContent('');
    setTags('');
    setImage('');
    setImagePreview('');
    setMetaTitle('');
    setMetaDescription('');
    setKeywords('');
    setEditorKey(k => k + 1);
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setPermalink(post.permalink);
    setPermalinkManual(true);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setTags(post.tags.join(', '));
    setImage(post.image ?? '');
    setImagePreview(post.image ?? '');
    setMetaTitle(post.metaTitle ?? '');
    setMetaDescription(post.metaDescription ?? '');
    setKeywords(post.keywords?.join(', ') ?? '');
    setEditorKey(k => k + 1);
    setShowPosts(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
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
    };

    if (editingPost) {
      await updatePost(editingPost.id, postData);
    } else {
      await addPost(postData);
    }

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
            {editingPost ? 'Edit Post' : 'Blog CMS Panel'}
          </h1>
          <div className="flex items-center gap-4">
            {editingPost && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center gap-2"
              >
                <PlusCircle size={15} /> New Post
              </button>
            )}
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

        {/* All Posts manager */}
        <div className="mb-8 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPosts(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-left"
          >
            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText size={15} className="text-purple-400" />
              All Posts ({posts.length})
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{showPosts ? '▲ Collapse' : '▼ Expand'}</span>
          </button>
          {showPosts && (
              <div className="divide-y divide-black/10 dark:divide-white/5">
              {posts.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">No posts yet.</p>
              ) : posts.map(post => (
                <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  {post.image && (
                    <img
                      src={post.image} alt={post.title}
                      className="w-14 h-14 object-cover rounded-xl shrink-0"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{post.date} · {post.readTime}</p>
                    <p className="text-xs text-purple-400/60 font-mono mt-0.5 truncate">/blog/{post.permalink}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      title="Edit post"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (window.confirm(`Delete "${post.title}"?`)) deletePost(post.id); }}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingPost && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Pencil size={14} /> Editing: <span className="font-semibold text-gray-900 dark:text-white">{editingPost.title}</span>
            </p>
            <button type="button" onClick={resetForm} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
          </div>
        )}

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
                  if (editingPost) return;
                  setPermalinkManual(true);
                  setPermalink(slugify(e.target.value));
                }}
                readOnly={!!editingPost}
                className={`flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-mono text-sm${editingPost ? ' opacity-60 cursor-not-allowed' : ''}`}
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
              /* ── Editor base (both modes) ───────────────────── */
              #blog-editor-wrap .rsw-ce {
                min-height: 380px;
                font-size: 15px;
                line-height: 1.8;
                padding: 16px 20px;
                color: #111827;
              }
              #blog-editor-wrap .rsw-ce h1 { font-size: 1.8em; font-weight: 700; margin: .6em 0 .4em; }
              #blog-editor-wrap .rsw-ce h2 { font-size: 1.4em; font-weight: 600; margin: .6em 0 .3em; }
              #blog-editor-wrap .rsw-ce h3 { font-size: 1.15em; font-weight: 600; margin: .5em 0 .2em; }
              #blog-editor-wrap .rsw-toolbar {
                flex-wrap: wrap; gap: 2px; padding: 4px 6px;
                background: rgba(245, 245, 255, 0.98) !important;
                border-bottom: 1px solid rgba(0,0,0,0.08) !important;
              }
              #blog-editor-wrap button.rsw-btn { color: #374151; border-radius: 4px; }
              #blog-editor-wrap button.rsw-btn:hover { background: rgba(124,58,237,0.12); }
              #blog-editor-wrap .rsw-separator { border-color: rgba(0,0,0,0.12); }
              #blog-editor-wrap .rsw-ce a { color: #7c3aed; text-decoration: underline; }
              #blog-editor-wrap .rsw-ce figure { text-align: center; margin: 1.2em 0; }
              #blog-editor-wrap .rsw-ce figure img { display: inline-block; border-radius: 10px; max-width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
              #blog-editor-wrap .rsw-ce figure figcaption { font-size: 0.85em; color: #6b7280; margin-top: 5px; font-style: italic; }
              #blog-editor-wrap .rsw-ce pre { background: #f1f5f9; border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 14px 18px; overflow-x: auto; margin: 1em 0; line-height: 1.6; }
              #blog-editor-wrap .rsw-ce pre code { font-family: 'Fira Code', Consolas, monospace; color: #6d28d9; }
              /* ── Dark mode overrides ────────────────────────── */
              html.dark #blog-editor-wrap .rsw-ce { color: #e2e8f0; }
              html.dark #blog-editor-wrap .rsw-ce a { color: #60a5fa; }
              html.dark #blog-editor-wrap .rsw-toolbar {
                background: rgba(15, 10, 40, 0.95) !important;
                border-bottom: 1px solid rgba(255,255,255,0.08) !important;
              }
              html.dark #blog-editor-wrap button.rsw-btn { color: #e2e8f0; }
              html.dark #blog-editor-wrap button.rsw-btn:hover { background: rgba(167,139,250,0.2); }
              html.dark #blog-editor-wrap .rsw-separator { border-color: rgba(255,255,255,0.12); }
              html.dark #blog-editor-wrap .rsw-ce figure figcaption { color: #9ca3af; }
              html.dark #blog-editor-wrap .rsw-ce pre { background: #0d0a1e; border: 1px solid rgba(167,139,250,0.25); }
              html.dark #blog-editor-wrap .rsw-ce pre code { color: #c4b5fd; }
            `}</style>
            <div id="blog-editor-wrap" className="dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
              <EditorProvider key={editorKey}>
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
                    <Separator />
                    <HeadingPicker />
                    <Separator />
                    <InlineImageButton />
                    <CodeBlockButton />
                  </Toolbar>
                </Editor>
              </EditorProvider>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            {editingPost && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors"
              >
                Cancel
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-xl flex items-center space-x-2 shadow-lg shadow-purple-500/20"
            >
              <Save size={20} />
              <span>{editingPost ? 'Update Post' : 'Publish Post'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Admin;

