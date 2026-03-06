import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Image as ImageIcon, Tag, Type, AlignLeft, Layout, LogOut, Link as LinkIcon,
  Search, Upload, Pencil, Trash2, FileText, PlusCircle, Code, Users, Megaphone,
  Settings, LayoutDashboard, Globe, X, Copy, Check, Eye, EyeOff, Bell, ChevronDown,
  TrendingUp, Radio, ExternalLink, Shield, UserCheck, AlertTriangle, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, BtnLink, BtnClearFormatting, BtnBulletList, BtnNumberedList, BtnRedo, BtnUndo, Separator } from 'react-simple-wysiwyg';
import { useBlog } from '../contexts/BlogContext';
import { slugify } from '../contexts/BlogContext';
import type { BlogPost } from '../contexts/BlogContext';
import { useAdmin } from '../contexts/AdminContext';
import type { TeamMember, SiteAd, SiteSettings } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

// ── Colour helpers ─────────────────────────────────────────────────────────
const TEXT_COLORS = [
  '#ffffff','#e2e8f0','#94a3b8','#6b7280',
  '#f87171','#fb923c','#fbbf24','#4ade80',
  '#34d399','#60a5fa','#818cf8','#a78bfa',
  '#f472b6','#22d3ee','#facc15','#f59e0b',
];
const HIGHLIGHT_COLORS = [
  '#fbbf24','#4ade80','#60a5fa','#f472b6',
  '#f87171','#a78bfa','#22d3ee','#fb923c','transparent',
];

const ColorDropdown: React.FC<{
  label: React.ReactNode; colors: string[]; onPick: (c: string) => void; activeColor: string;
}> = ({ label, colors, onPick, activeColor }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button type="button" onMouseDown={e => { e.preventDefault(); setOpen(v => !v); }}
        style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'3px 7px', cursor:'pointer', background:'none', border:'none', lineHeight:1 }}>
        {label}
        <span style={{ display:'block', width:14, height:3, background: activeColor === 'transparent' ? 'repeating-linear-gradient(45deg,#888 0,#888 2px,transparent 2px,transparent 6px)' : activeColor, borderRadius:2, marginTop:2, border:'1px solid rgba(255,255,255,0.2)' }} />
      </button>
      {open && (
        <div style={{ position:'absolute', top:'110%', left:0, zIndex:9999, background:'#1e1830', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:8, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:4, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          {colors.map(c => (
            <button key={c} type="button" title={c} onMouseDown={e => { e.preventDefault(); onPick(c); setOpen(false); }}
              style={{ background: c === 'transparent' ? 'repeating-linear-gradient(45deg,#555 0,#555 2px,#222 2px,#222 6px)' : c, width:22, height:22, borderRadius:4, border: activeColor === c ? '2px solid #a78bfa' : '1px solid rgba(255,255,255,0.2)', cursor:'pointer' }} />
          ))}
        </div>
      )}
    </span>
  );
};

const TextColorPicker: React.FC = () => {
  const [color, setColor] = useState('#ffffff');
  return <ColorDropdown label={<span style={{ fontWeight:700, fontSize:13 }}>A</span>} colors={TEXT_COLORS}
    onPick={c => { setColor(c); document.execCommand('foreColor', false, c); }} activeColor={color} />;
};
const HighlightPicker: React.FC = () => {
  const [color, setColor] = useState('transparent');
  return <ColorDropdown label={<span style={{ fontWeight:700, fontSize:12, padding:'0 3px', borderRadius:2, background: color === 'transparent' ? 'none' : color, color:'#1a1a2e' }}>H</span>}
    colors={HIGHLIGHT_COLORS} onPick={c => { setColor(c); document.execCommand('hiliteColor', false, c); }} activeColor={color} />;
};

const FONT_SIZES = [10,11,12,13,14,15,16,17,18,20,22,24,28,32,36,42,48];
const FontSizePicker: React.FC = () => {
  const [open, setOpen] = useState(false); const [size, setSize] = useState(16); const [inputVal, setInputVal] = useState('16');
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const apply = (px: number) => {
    setSize(px); setInputVal(String(px)); setOpen(false);
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    document.execCommand('fontSize', false, '7');
    const editorEl = document.querySelector('#blog-editor-wrap .rsw-ce') as HTMLElement;
    if (!editorEl) return;
    editorEl.querySelectorAll('font[size="7"]').forEach(font => {
      const s = document.createElement('span'); s.style.fontSize = `${px}px`; s.innerHTML = (font as HTMLElement).innerHTML;
      font.parentNode?.replaceChild(s, font);
    });
  };
  const commit = () => { const px = Math.max(6, Math.min(200, parseInt(inputVal) || size)); apply(px); };
  return (
    <span ref={ref} style={{ position:'relative', display:'inline-flex', alignItems:'center' }}>
      <button type="button" onMouseDown={e => { e.preventDefault(); setOpen(v => !v); }}
        style={{ display:'flex', alignItems:'center', gap:2, padding:'3px 7px', cursor:'pointer', background:'none', border:'none', color:'#e2e8f0', fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
        {size}px <span style={{ fontSize:8 }}>▼</span>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'110%', left:0, zIndex:9999, background:'#1e1830', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, padding:8, minWidth:130, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:4, padding:'0 4px 6px', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:4 }}>
            <input type="number" min={6} max={200} value={inputVal} onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
              style={{ width:54, padding:'3px 7px', borderRadius:5, border:'1px solid rgba(167,139,250,0.3)', background:'rgba(0,0,0,0.3)', color:'#e2e8f0', fontSize:12, outline:'none' }} />
            <span style={{ color:'#9ca3af', fontSize:11 }}>px</span>
            <button type="button" onMouseDown={e => { e.preventDefault(); commit(); }}
              style={{ padding:'3px 7px', borderRadius:5, background:'rgba(124,58,237,0.5)', border:'none', color:'#e2e8f0', fontSize:11, cursor:'pointer', fontWeight:600 }}>✓</button>
          </div>
          <div style={{ maxHeight:220, overflowY:'auto', scrollbarWidth:'none' }}>
            {FONT_SIZES.map(px => (
              <button key={px} type="button" onMouseDown={e => { e.preventDefault(); apply(px); }}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'5px 10px', background: size === px ? 'rgba(167,139,250,0.2)' : 'none', border:'none', color: size === px ? '#a78bfa' : '#e2e8f0', cursor:'pointer', borderRadius:5, fontSize:12 }}
                onMouseEnter={e => { if (size !== px) e.currentTarget.style.background = 'rgba(167,139,250,0.1)'; }}
                onMouseLeave={e => { if (size !== px) e.currentTarget.style.background = 'none'; }}>
                <span>{px}px</span><span style={{ fontSize: px > 20 ? 14 : px < 12 ? 10 : 12, opacity:0.5 }}>Aa</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </span>
  );
};

const HEADING_OPTIONS = [
  { label:'Normal', tag:'p', fs:13, fw:400 },
  { label:'H1 – Title', tag:'h1', fs:20, fw:700 },
  { label:'H2 – Heading', tag:'h2', fs:16, fw:600 },
  { label:'H3 – Subheading', tag:'h3', fs:13, fw:600 },
];
const HeadingPicker: React.FC = () => {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <span ref={ref} style={{ position:'relative', display:'inline-flex', alignItems:'center' }}>
      <button type="button" onMouseDown={e => { e.preventDefault(); setOpen(v => !v); }}
        style={{ display:'flex', alignItems:'center', gap:2, padding:'3px 8px', cursor:'pointer', background:'none', border:'none', color:'#e2e8f0', fontSize:13, fontWeight:700 }}>
        T<span style={{ fontSize:8 }}>▼</span>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'110%', left:0, zIndex:9999, background:'#1e1830', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:4, minWidth:170, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          {HEADING_OPTIONS.map(opt => (
            <button key={opt.tag} type="button" onMouseDown={e => { e.preventDefault(); document.execCommand('formatBlock', false, opt.tag); setOpen(false); }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'7px 12px', background:'none', border:'none', color:'#e2e8f0', cursor:'pointer', borderRadius:5, fontSize: opt.fs, fontWeight: opt.fw }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(167,139,250,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </span>
  );
};

const InlineImageButton: React.FC = () => {
  const [open, setOpen] = useState(false); const [url, setUrl] = useState(''); const [alt, setAlt] = useState(''); const [width, setWidth] = useState('75');
  const savedRange = useRef<Range | null>(null); const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const saveRange = () => { const sel = window.getSelection(); if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange(); };
  const insert = () => {
    if (!url) return;
    const caption = alt ? `<figcaption style="font-size:0.85em;color:#9ca3af;margin-top:6px;font-style:italic">${alt}</figcaption>` : '';
    const html = `<figure style="text-align:center;margin:1.5em 0"><img src="${url}" alt="${alt}" style="width:${width}%;max-width:100%;border-radius:12px;display:inline-block;box-shadow:0 4px 24px rgba(0,0,0,0.4)" />${caption}</figure><p><br></p>`;
    if (savedRange.current) { const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(savedRange.current); }
    document.execCommand('insertHTML', false, html);
    setOpen(false); setUrl(''); setAlt(''); setWidth('75');
  };
  const inp: React.CSSProperties = { width:'100%', padding:'5px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(0,0,0,0.3)', color:'#e2e8f0', fontSize:12, boxSizing:'border-box', outline:'none', marginBottom:6 };
  return (
    <span ref={ref} style={{ position:'relative', display:'inline-flex', alignItems:'center' }}>
      <button type="button" title="Insert image" onMouseDown={e => { e.preventDefault(); saveRange(); setOpen(v => !v); }}
        style={{ display:'flex', alignItems:'center', padding:'3px 7px', cursor:'pointer', background:'none', border:'none', color:'#e2e8f0' }}>
        <ImageIcon size={14} />
      </button>
      {open && (
        <div style={{ position:'absolute', top:'110%', left:0, zIndex:9999, background:'#1e1830', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, padding:14, width:280, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          <p style={{ color:'#a78bfa', fontSize:11, fontWeight:600, marginBottom:10, marginTop:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>Insert Image</p>
          <input type="url" placeholder="Image URL" value={url} onChange={e => setUrl(e.target.value)} style={inp} />
          <input type="text" placeholder="Alt text / caption" value={alt} onChange={e => setAlt(e.target.value)} style={inp} />
          <p style={{ color:'#9ca3af', fontSize:11, margin:'0 0 5px' }}>Width</p>
          <div style={{ display:'flex', gap:4, marginBottom:10 }}>
            {[['25','S'],['50','M'],['75','L'],['100','Full']].map(item => (
              <button key={item[0]} type="button" onMouseDown={e => { e.preventDefault(); setWidth(item[0]); }}
                style={{ flex:1, padding:'4px 2px', borderRadius:5, fontSize:11, border:'1px solid', borderColor: width === item[0] ? '#7c3aed' : 'rgba(255,255,255,0.15)', background: width === item[0] ? 'rgba(124,58,237,0.3)' : 'none', color:'#e2e8f0', cursor:'pointer' }}>
                {item[1]}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button type="button" onMouseDown={e => { e.preventDefault(); insert(); }} disabled={!url}
              style={{ flex:1, padding:'6px 0', borderRadius:6, background: url ? '#7c3aed' : 'rgba(124,58,237,0.3)', color:'#fff', border:'none', cursor: url ? 'pointer' : 'not-allowed', fontSize:12, fontWeight:600 }}>Insert</button>
            <button type="button" onMouseDown={e => { e.preventDefault(); setOpen(false); }}
              style={{ flex:1, padding:'6px 0', borderRadius:6, background:'rgba(255,255,255,0.08)', color:'#e2e8f0', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:12 }}>Cancel</button>
          </div>
        </div>
      )}
    </span>
  );
};

const CodeBlockButton: React.FC = () => {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const insert = (fontSize: string) => {
    const html = `<pre style="background:#0d0a1e;border:1px solid rgba(167,139,250,0.25);border-radius:10px;padding:16px 20px;font-size:${fontSize};overflow-x:auto;margin:1em 0;line-height:1.6"><code style="font-family:'Fira Code',Consolas,monospace;color:#c4b5fd">// paste your code here</code></pre><p><br></p>`;
    document.execCommand('insertHTML', false, html); setOpen(false);
  };
  return (
    <span ref={ref} style={{ position:'relative', display:'inline-flex', alignItems:'center' }}>
      <button type="button" title="Insert code block" onMouseDown={e => { e.preventDefault(); setOpen(v => !v); }}
        style={{ display:'flex', alignItems:'center', padding:'3px 8px', cursor:'pointer', background:'none', border:'none', color:'#a78bfa', fontFamily:'monospace', fontSize:13, fontWeight:700 }}>{'</>'}</button>
      {open && (
        <div style={{ position:'absolute', top:'110%', left:0, zIndex:9999, background:'#1e1830', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:6, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
          <p style={{ color:'#9ca3af', fontSize:11, padding:'2px 8px 5px', margin:0 }}>Code block size</p>
          {[['13px','Small'],['15px','Normal'],['17px','Large']].map(item => (
            <button key={item[0]} type="button" onMouseDown={e => { e.preventDefault(); insert(item[0]); }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'7px 12px', background:'none', border:'none', color:'#e2e8f0', cursor:'pointer', borderRadius:5, fontFamily:'monospace', fontSize: item[0] }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(167,139,250,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              {item[1]}
            </button>
          ))}
        </div>
      )}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
const DashboardSection: React.FC = () => {
  const { posts } = useBlog();
  const { team, ads, notifications } = useAdmin();
  const stats = [
    { label:'Total Posts', value: posts.length, icon: FileText, color:'#a78bfa', bg:'rgba(167,139,250,0.1)' },
    { label:'Team Members', value: team.filter(m => m.active).length, icon: Users, color:'#60a5fa', bg:'rgba(96,165,250,0.1)' },
    { label:'Active Ads', value: ads.filter(a => a.active).length, icon: Megaphone, color:'#4ade80', bg:'rgba(74,222,128,0.1)' },
    { label:'Notifications Sent', value: notifications.length, icon: Bell, color:'#fb923c', bg:'rgba(251,146,60,0.1)' },
  ];
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <LayoutDashboard size={22} className="text-purple-500" /> Dashboard
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-[#0c0a20]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <TrendingUp size={14} className="text-gray-300 dark:text-gray-600" />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Recent Posts</h3>
      <div className="space-y-3">
        {posts.slice(0, 5).map(p => (
          <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0a20]">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate text-sm">{p.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.date} · {p.author}</p>
            </div>
            <a href={`/blog/${p.permalink}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-purple-500/10 text-purple-400 transition-colors ml-3">
              <ExternalLink size={14} />
            </a>
          </div>
        ))}
        {posts.length === 0 && <p className="text-gray-400 text-sm py-4 text-center">No posts yet.</p>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION: POSTS
// ═══════════════════════════════════════════════════════════════════════════
const PostsSection: React.FC = () => {
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
  const [htmlMode, setHtmlMode] = useState(false);
  const [view, setView] = useState<'list' | 'editor'>('list');

  useEffect(() => { if (!permalinkManual && title) setPermalink(slugify(title)); }, [title, permalinkManual]);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { const r = ev.target?.result as string; setImage(r); setImagePreview(r); };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingPost(null); setTitle(''); setPermalink(''); setPermalinkManual(false);
    setExcerpt(''); setContent(''); setTags(''); setImage(''); setImagePreview('');
    setMetaTitle(''); setMetaDescription(''); setKeywords(''); setEditorKey(k => k + 1); setHtmlMode(false); setView('list');
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post); setTitle(post.title); setPermalink(post.permalink); setPermalinkManual(true);
    setExcerpt(post.excerpt); setContent(post.content); setTags(post.tags.join(', '));
    setImage(post.image ?? ''); setImagePreview(post.image ?? '');
    setMetaTitle(post.metaTitle ?? ''); setMetaDescription(post.metaDescription ?? '');
    setKeywords(post.keywords?.join(', ') ?? ''); setEditorKey(k => k + 1); setHtmlMode(false); setView('editor');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      title, excerpt, content, tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      image, author, permalink: permalink || slugify(title),
      metaTitle: metaTitle || title, metaDescription: metaDescription || excerpt,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
    };
    if (editingPost) { await updatePost(editingPost.id, postData); } else { await addPost(postData); }
    resetForm();
    navigate('/blog');
  };

  if (view === 'list') return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText size={22} className="text-purple-500" /> Blog Posts
        </h2>
        <button onClick={() => setView('editor')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all">
          <PlusCircle size={15} /> New Post
        </button>
      </div>
      <div className="space-y-3">
        {posts.length === 0 ? <p className="text-center text-gray-400 py-12 text-sm">No posts yet. Create one!</p> :
          posts.map(post => (
            <div key={post.id} className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0a20] hover:border-purple-500/30 transition-colors">
              {post.image && <img src={post.image} alt={post.title} className="w-14 h-14 object-cover rounded-xl shrink-0" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{post.date} · {post.readTime} · by {post.author}</p>
                <div className="flex gap-1.5 mt-1.5">
                  {post.tags.slice(0,3).map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-medium">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a href={`/blog/${post.permalink}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="View"><ExternalLink size={14} /></a>
                <button onClick={() => startEdit(post)} className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => { if (window.confirm(`Delete "${post.title}"?`)) deletePost(post.id); }} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={resetForm} className="p-2 rounded-xl border border-black/10 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={16} /></button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Pencil size={20} className="text-purple-500" /> {editingPost ? 'Edit Post' : 'New Post'}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Type size={15} /> Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Post title..."
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white" />
        </div>
        {/* Permalink */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><LinkIcon size={15} /> Permalink</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm shrink-0">/blog/</span>
            <input type="text" value={permalink} readOnly={!!editingPost}
              onChange={e => { if (!editingPost) { setPermalinkManual(true); setPermalink(slugify(e.target.value)); } }}
              className={`flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white font-mono text-sm${editingPost ? ' opacity-60 cursor-not-allowed' : ''}`}
              placeholder="auto-generated" />
            {permalinkManual && !editingPost && <button type="button" onClick={() => { setPermalinkManual(false); setPermalink(slugify(title)); }} className="text-xs text-purple-400 hover:text-purple-300 whitespace-nowrap">Reset</button>}
          </div>
        </div>
        {/* Cover Image */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><ImageIcon size={15} /> Cover Image</label>
          <div className="grid md:grid-cols-2 gap-4">
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-purple-500 rounded-xl p-5 flex flex-col items-center gap-2 transition-colors">
              <Upload size={20} className="text-gray-400" /><span className="text-sm text-gray-400">Upload image</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
            </div>
            <div className="space-y-2">
              <input type="url" value={typeof image === 'string' && !image.startsWith('data:') ? image : ''} onChange={e => { setImage(e.target.value); setImagePreview(e.target.value); }}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm" placeholder="Or paste URL…" />
              {imagePreview && <div className="relative rounded-xl overflow-hidden h-24 bg-black/20">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview('')} />
                <button type="button" onClick={() => { setImage(''); setImagePreview(''); }} className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 transition-colors">✕</button>
              </div>}
            </div>
          </div>
        </div>
        {/* Excerpt */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><AlignLeft size={15} /> Excerpt</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} required placeholder="Short summary…"
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white h-20 resize-none" />
        </div>
        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Tag size={15} /> Tags (comma separated)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="AI, React, Design…"
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white" />
        </div>
        {/* SEO */}
        <div className="border border-purple-500/20 rounded-2xl p-5 space-y-4 bg-purple-500/5">
          <h3 className="text-sm font-semibold text-purple-500 flex items-center gap-2 uppercase tracking-wider"><Search size={14} /> SEO & Meta</h3>
          <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} maxLength={60} placeholder="Meta title (max 60 chars)…"
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm" />
          <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} maxLength={160} placeholder="Meta description (max 160 chars)…"
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm h-16 resize-none" />
          <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Keywords, comma separated…"
            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm" />
        </div>
        {/* Content editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Layout size={15} /> Content</label>
          <style>{`
            #blog-editor-wrap .rsw-ce { min-height:360px; font-size:18px; line-height:1.8; padding:16px 20px; color:#111827; }
            #blog-editor-wrap .rsw-ce h1 { font-size:2.25em; font-weight:700; margin:.6em 0 .4em; }
            #blog-editor-wrap .rsw-ce h2 { font-size:1.875em; font-weight:600; margin:.6em 0 .3em; }
            #blog-editor-wrap .rsw-ce h3 { font-size:1.5em; font-weight:600; margin:.5em 0 .2em; }
            #blog-editor-wrap .rsw-toolbar { flex-wrap:wrap; gap:2px; padding:4px 6px; background:rgba(245,245,255,0.98) !important; border-bottom:1px solid rgba(0,0,0,0.08) !important; }
            #blog-editor-wrap button.rsw-btn { color:#374151; border-radius:4px; }
            #blog-editor-wrap button.rsw-btn:hover { background:rgba(124,58,237,0.12); }
            #blog-editor-wrap .rsw-separator { border-color:rgba(0,0,0,0.12); }
            #blog-editor-wrap .rsw-ce a { color:#7c3aed; text-decoration:underline; }
            #blog-editor-wrap .rsw-ce figure { text-align:center; margin:1.2em 0; }
            #blog-editor-wrap .rsw-ce figure img { display:inline-block; border-radius:10px; max-width:100%; box-shadow:0 4px 20px rgba(0,0,0,0.2); }
            #blog-editor-wrap .rsw-ce pre { background:#f1f5f9; border:1px solid rgba(0,0,0,0.1); border-radius:10px; padding:14px 18px; overflow-x:auto; margin:1em 0; line-height:1.6; }
            #blog-editor-wrap .rsw-ce pre code { font-family:'Fira Code',Consolas,monospace; color:#6d28d9; }
            html.dark #blog-editor-wrap .rsw-ce { color:#e2e8f0; }
            html.dark #blog-editor-wrap .rsw-toolbar { background:rgba(15,10,40,0.95) !important; border-bottom:1px solid rgba(255,255,255,0.08) !important; }
            html.dark #blog-editor-wrap button.rsw-btn { color:#e2e8f0; }
            html.dark #blog-editor-wrap button.rsw-btn:hover { background:rgba(167,139,250,0.2); }
            html.dark #blog-editor-wrap .rsw-separator { border-color:rgba(255,255,255,0.12); }
            html.dark #blog-editor-wrap .rsw-ce pre { background:#0d0a1e; border:1px solid rgba(167,139,250,0.25); }
            html.dark #blog-editor-wrap .rsw-ce pre code { color:#c4b5fd; }
            #blog-html-textarea { display:block; width:100%; min-height:400px; font-family:'Fira Code',Consolas,monospace; font-size:13px; line-height:1.7; padding:18px 20px; resize:vertical; outline:none; border:none; background:#0d0a1e; color:#c4b5fd; box-sizing:border-box; tab-size:2; }
            html:not(.dark) #blog-html-textarea { background:#f8f7ff; color:#4c1d95; }
          `}</style>
          <div style={{ display:'flex' }}>
            <button type="button" onClick={() => { if (htmlMode) { setHtmlMode(false); setEditorKey(k => k + 1); } }}
              style={{ padding:'7px 18px', fontSize:13, fontWeight:600, cursor:'pointer', border:'1px solid rgba(167,139,250,0.3)', borderBottom:'none', borderRight:'none', borderRadius:'10px 0 0 0', background: !htmlMode ? '#7c3aed' : 'rgba(124,58,237,0.06)', color: !htmlMode ? '#fff' : '#9ca3af', display:'flex', alignItems:'center', gap:6, transition:'all 0.15s' }}>
              <Pencil size={12} /> Compose
            </button>
            <button type="button" onClick={() => setHtmlMode(true)}
              style={{ padding:'7px 18px', fontSize:13, fontWeight:600, cursor:'pointer', border:'1px solid rgba(167,139,250,0.3)', borderBottom:'none', borderLeft:'1px solid rgba(167,139,250,0.15)', borderRadius:'0 10px 0 0', background: htmlMode ? '#7c3aed' : 'rgba(124,58,237,0.06)', color: htmlMode ? '#fff' : '#9ca3af', display:'flex', alignItems:'center', gap:6, transition:'all 0.15s' }}>
              <Code size={12} /> HTML
            </button>
          </div>
          <div id="blog-editor-wrap" className="dark:bg-black/40 border border-gray-200 dark:border-white/10 overflow-hidden" style={{ borderRadius:'0 10px 10px 10px' }}>
            {htmlMode ? (
              <textarea id="blog-html-textarea" value={content} onChange={e => setContent(e.target.value)} spellCheck={false} autoCorrect="off" autoCapitalize="off" />
            ) : (
              <EditorProvider key={editorKey}>
                <Editor value={content} onChange={e => setContent(e.target.value)} containerProps={{ style:{ minHeight:'380px', overflowY:'auto' } }}>
                  <Toolbar>
                    <BtnUndo /><BtnRedo /><Separator />
                    <BtnBold /><BtnItalic /><BtnUnderline /><BtnStrikeThrough /><Separator />
                    <TextColorPicker /><HighlightPicker /><Separator />
                    <BtnBulletList /><BtnNumberedList /><Separator />
                    <BtnLink /><BtnClearFormatting /><Separator />
                    <HeadingPicker /><FontSizePicker /><Separator />
                    <InlineImageButton /><CodeBlockButton />
                  </Toolbar>
                </Editor>
              </EditorProvider>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">Cancel</button>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20">
            <Save size={18} /> {editingPost ? 'Update Post' : 'Publish Post'}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION: TEAM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════
const ROLE_META: Record<string, { label:string; color:string; bg:string }> = {
  writer:  { label:'Writer',  color:'#60a5fa', bg:'rgba(96,165,250,0.12)' },
  editor:  { label:'Editor',  color:'#4ade80', bg:'rgba(74,222,128,0.12)' },
  manager: { label:'Manager', color:'#fb923c', bg:'rgba(251,146,60,0.12)'  },
};

const generatePassword = () => {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const TeamSection: React.FC = () => {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useAdmin();
  const [showAdd, setShowAdd] = useState(false);
  const [credsFor, setCredsFor] = useState<TeamMember | null>(null);
  const [copied, setCopied] = useState('');
  const [promoteId, setPromoteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name:'', email:'', username:'', password:'', role:'writer' as 'writer'|'editor'|'manager', active:true });

  const resetForm = () => { setForm({ name:'', email:'', username:'', password:'', role:'writer', active:true }); setShowAdd(false); };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTeamMember(form);
    resetForm();
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key); setTimeout(() => setCopied(''), 2000);
  };

  const ROLES: ('writer'|'editor'|'manager')[] = ['writer','editor','manager'];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Users size={22} className="text-purple-500" /> Team Management
        </h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all">
          <PlusCircle size={15} /> Add Member
        </button>
      </div>
      <div className="mb-6 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
        <Shield size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-400">Role permissions</p>
          <p className="text-xs text-gray-400 mt-0.5"><strong className="text-blue-400">Writers</strong> draft posts only. <strong className="text-green-400">Editors</strong> can create & edit. <strong className="text-orange-400">Managers</strong> can publish & approve. Only the main admin can manage team & settings.</p>
        </div>
      </div>

      {/* Add Member Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            className="mb-6 p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Add New Member</h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
              {[['text','name','Full Name','Full Name'],['email','email','Email','Email'],['text','username','Username','Username']].map(([t,k,p,l]) => (
                <div key={k}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">{l}</label>
                  <input type={t} required placeholder={p} value={form[k as 'name'|'email'|'username']} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
                <div className="flex gap-2">
                  <input type="text" required placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm font-mono" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, password: generatePassword() }))}
                    className="px-3 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors text-xs font-medium whitespace-nowrap">Auto</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'writer'|'editor'|'manager' }))}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm">
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-gray-500 text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm">Add Member</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team list */}
      <div className="space-y-3">
        {team.length === 0 && <p className="text-center text-gray-400 text-sm py-12">No team members yet.</p>}
        {team.map(m => (
          <div key={m.id} className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0a20] transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: ROLE_META[m.role].bg, color: ROLE_META[m.role].color }}>
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.name}</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: ROLE_META[m.role].bg, color: ROLE_META[m.role].color }}>{ROLE_META[m.role].label}</span>
                {!m.active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400">Inactive</span>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{m.email} · @{m.username} · Since {m.createdAt}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Role promote/demote */}
              <div className="relative">
                <button onClick={() => setPromoteId(promoteId === m.id ? null : m.id)} className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors" title="Change role">
                  <UserCheck size={14} />
                </button>
                <AnimatePresence>
                  {promoteId === m.id && (
                    <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
                      className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1e1830] border border-black/10 dark:border-white/15 rounded-xl overflow-hidden shadow-xl z-50 min-w-[120px]">
                      {ROLES.map(r => (
                        <button key={r} onClick={() => { updateTeamMember(m.id, { role:r }); setPromoteId(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-purple-500/10 transition-colors"
                          style={{ color: m.role === r ? ROLE_META[r].color : undefined, fontWeight: m.role === r ? 700 : 400 }}>
                          {m.role === r && <span className="text-[10px]">✓</span>} {ROLE_META[r].label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Credentials */}
              <button onClick={() => setCredsFor(m)} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title="View credentials"><Key size={14} /></button>
              {/* Active toggle */}
              <button onClick={() => updateTeamMember(m.id, { active: !m.active })}
                className={`p-2 rounded-lg transition-colors ${m.active ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-green-500/10 hover:text-green-400'}`}
                title={m.active ? 'Deactivate' : 'Activate'}>
                {m.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
              </button>
              {/* Delete */}
              <button onClick={() => { if (window.confirm(`Remove ${m.name}?`)) deleteTeamMember(m.id); }} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Remove"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Credentials Modal */}
      <AnimatePresence>
        {credsFor && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setCredsFor(null)}>
            <motion.div initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#0c0a20] border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Shield size={18} className="text-purple-500" /> Login Credentials</h3>
                <button onClick={() => setCredsFor(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={18} /></button>
              </div>
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-300">Share this directly via a private message. Do not share publicly.</p>
              </div>
              {[
                { label:'Login URL', value:`${window.location.origin}/login`, key:'url' },
                { label:'Username', value:credsFor.username, key:'user' },
                { label:'Password', value:credsFor.password, key:'pass' },
                { label:'Role', value:ROLE_META[credsFor.role].label, key:'role' },
              ].map(row => (
                <div key={row.key} className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/5 last:border-0">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{row.label}</p>
                    <p className="text-sm font-mono mt-0.5 text-gray-900 dark:text-white">{row.value}</p>
                  </div>
                  <button onClick={() => copyText(row.value, row.key)} className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors">
                    {copied === row.key ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
              <button onClick={() => { const all = `Login URL: ${window.location.origin}/login\nUsername: ${credsFor.username}\nPassword: ${credsFor.password}\nRole: ${ROLE_META[credsFor.role].label}`; copyText(all, 'all'); }}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2">
                {copied === 'all' ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy All</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Lucide Key icon (not in react-simple-wysiwyg imports)
const Key: React.FC<{size?:number}> = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// SECTION: ADS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════
const AdsSection: React.FC = () => {
  const { ads, addAd, updateAd, deleteAd } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', imageUrl:'', linkUrl:'', position:'between_posts' as SiteAd['position'], active:true });

  const POS_META: Record<string, { label:string; color:string }> = {
    between_posts: { label:'Between Posts', color:'#60a5fa' },
    corner:        { label:'Corner Float', color:'#4ade80' },
    sidebar:       { label:'Sidebar', color:'#fb923c' },
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAd(form);
    setForm({ title:'', imageUrl:'', linkUrl:'', position:'between_posts', active:true }); setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Megaphone size={22} className="text-purple-500" /> Ads Management
        </h2>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all">
          <PlusCircle size={15} /> Add Ad
        </button>
      </div>
      <div className="mb-4 p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
        <Radio size={16} className="text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-gray-400"><strong className="text-blue-400">Between Posts</strong> — appears between blog cards on the blog listing page. <strong className="text-green-400">Corner Float</strong> — fixed bottom-right overlay on blog post pages. <strong className="text-orange-400">Sidebar</strong> — reserved for future sidebar slot.</p>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            onSubmit={handleAdd} className="mb-6 p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[['text','title','Ad title / label'],['url','imageUrl','Image URL (banner)'],['url','linkUrl','Destination URL']].map(([t,k,p]) => (
                <div key={k} className={k === 'title' ? '' : ''}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block capitalize">{p}</label>
                  <input type={t} required placeholder={p} value={form[k as 'title'|'imageUrl'|'linkUrl']} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Position</label>
                <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value as SiteAd['position'] }))}
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white text-sm">
                  {Object.entries(POS_META).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-gray-500 text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm">Save Ad</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="space-y-4">
        {ads.length === 0 && <p className="text-center text-gray-400 text-sm py-12">No ads yet.</p>}
        {ads.map(ad => (
          <div key={ad.id} className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0a20]">
            {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-20 h-12 object-cover rounded-xl shrink-0 border border-black/10 dark:border-white/10" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{ad.title}</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background:`${POS_META[ad.position].color}20`, color:POS_META[ad.position].color }}>{POS_META[ad.position].label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ad.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{ad.active ? 'Active' : 'Paused'}</span>
              </div>
              <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:underline truncate block max-w-xs">{ad.linkUrl}</a>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => updateAd(ad.id, { active: !ad.active })} className={`p-2 rounded-lg transition-colors ${ad.active ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400':'bg-red-500/10 text-red-400 hover:bg-green-500/10 hover:text-green-400'}`} title={ad.active?'Pause':'Activate'}>{ad.active ? <ToggleRight size={15}/> : <ToggleLeft size={15}/>}</button>
              <button onClick={() => { if (window.confirm(`Delete ad "${ad.title}"?`)) deleteAd(ad.id); }} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION: NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
const NotificationsSection: React.FC = () => {
  const { notifications, sendNotification } = useAdmin();
  const [form, setForm] = useState({ title:'', body:'', url:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true);
    await sendNotification(form);
    setForm({ title:'', body:'', url:'' }); setSending(false); setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <Bell size={22} className="text-purple-500" /> Push Notifications
      </h2>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Compose */}
        <div>
          <div className="mb-4 p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
            <Radio size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-400">Notifications are sent to blog visitors who have granted browser permission. They appear instantly on open tabs and on the next visit for others.</p>
          </div>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Title</label>
              <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} placeholder="New post published!"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Message</label>
              <textarea required value={form.body} onChange={e => setForm(f => ({ ...f, body:e.target.value }))} placeholder="Check out the latest post on AI & React…" rows={3}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Link URL (optional)</label>
              <input type="url" value={form.url} onChange={e => setForm(f => ({ ...f, url:e.target.value }))} placeholder="https://yourdomain.com/blog/post-slug"
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white" />
            </div>
            <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} type="submit" disabled={sending}
              className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${sent ? 'bg-green-600 shadow-green-500/20' : 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/20'}`}>
              {sending ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</> :
               sent ? <><Check size={18} /> Sent!</> : <><Bell size={18} /> Send Notification</>}
            </motion.button>
          </form>
        </div>
        {/* History */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">History</h3>
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {notifications.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No notifications sent yet.</p>}
            {notifications.map(n => (
              <div key={n.id} className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0a20]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.body}</p>
                    {n.url && <a href={n.url} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:underline mt-1 block">{n.url}</a>}
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{n.sentAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION: SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
const SettingsSection: React.FC = () => {
  const { settings, saveSettings } = useAdmin();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await saveSettings(form); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const Toggle: React.FC<{ label:string; desc?:string; checked:boolean; onChange:(v:boolean)=>void; warn?:boolean }> = ({ label, desc, checked, onChange, warn }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${warn ? 'border-red-500/20 bg-red-500/5' : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0a20]'}`}>
      <div>
        <p className={`text-sm font-semibold ${warn ? 'text-red-400' : 'text-gray-900 dark:text-white'}`}>{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors ${checked ? (warn ? 'bg-red-500' : 'bg-purple-600') : 'bg-gray-300 dark:bg-gray-700'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <Settings size={22} className="text-purple-500" /> Settings
      </h2>
      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        {/* Site info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site Info</h3>
          {[['Site Name','siteName','Viren Pandey'],['Tagline','tagline','Engineering Blogs']].map(([l,k,p]) => (
            <div key={k}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">{l}</label>
              <input type="text" value={form[k as 'siteName'|'tagline']} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white" />
            </div>
          ))}
        </div>
        {/* Site controls */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Controls</h3>
          <Toggle label="Maintenance Mode" desc="Displays a maintenance banner while visiting the site." checked={form.maintenanceMode} onChange={v => setForm(f => ({ ...f, maintenanceMode:v }))} warn={form.maintenanceMode} />
        </div>
        {/* 404 settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">404 Page</h3>
          <Toggle label="Random 404 Messages" desc="Show a different funny message each time someone hits a 404." checked={form.randomNotFound} onChange={v => setForm(f => ({ ...f, randomNotFound:v }))} />
          {!form.randomNotFound && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Custom 404 Message</label>
              <textarea value={form.customNotFoundMsg} onChange={e => setForm(f => ({ ...f, customNotFoundMsg: e.target.value }))} rows={3}
                placeholder="Oops! This page doesn't exist." className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-900 dark:text-white resize-none" />
            </div>
          )}
        </div>
        <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} type="submit" disabled={saving}
          className={`px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg transition-all ${saved ? 'bg-green-600 shadow-green-500/20' : 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/20'}`}>
          {saving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</> :
           saved ? <><Check size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
        </motion.button>
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
type Section = 'dashboard' | 'posts' | 'team' | 'ads' | 'notifications' | 'settings';

const NAV_ITEMS: { id: Section; label: string; Icon: React.FC<{size?:number;className?:string}> }[] = [
  { id:'dashboard', label:'Dashboard', Icon: LayoutDashboard },
  { id:'posts', label:'Blog Posts', Icon: FileText },
  { id:'team', label:'Team', Icon: Users },
  { id:'ads', label:'Ads', Icon: Megaphone },
  { id:'notifications', label:'Notifications', Icon: Bell },
  { id:'settings', label:'Settings', Icon: Settings },
];

const AdminSidebar: React.FC<{ active: Section; setActive: (s: Section) => void }> = ({ active, setActive }) => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Admin';
  const adminRole = localStorage.getItem('adminRole') || 'admin';

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
    navigate('/login');
  };

  // Sections visible to role
  const visibleRoles: Record<Section, string[]> = {
    dashboard: ['admin','manager','editor','writer'],
    posts: ['admin','manager','editor','writer'],
    team: ['admin','manager'],
    ads: ['admin','manager'],
    notifications: ['admin','manager'],
    settings: ['admin'],
  };

  const visibleItems = NAV_ITEMS.filter(item => visibleRoles[item.id].includes(adminRole));

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#07051a] border-r border-black/10 dark:border-white/8 flex flex-col z-40 shadow-xl">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-black/10 dark:border-white/8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Layout size={16} className="text-white" />
          </div>
          <span className="font-black text-gray-900 dark:text-white text-sm tracking-tight">CMS Panel</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">{adminName.charAt(0).toUpperCase()}</div>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">{adminName}</p>
            <p className="text-[10px] text-gray-400 capitalize leading-none mt-0.5">{adminRole}</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${active === item.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
            <item.Icon size={17} />
            {item.label}
          </button>
        ))}
      </nav>
      {/* Footer */}
      <div className="px-3 pb-6 space-y-0.5 border-t border-black/10 dark:border-white/8 pt-4">
        <a href="/blog" target="_blank" rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all">
          <Globe size={17} /> View Site
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all text-left">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN Admin
// ═══════════════════════════════════════════════════════════════════════════
const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>('posts');

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') navigate('/login');
  }, [navigate]);

  const SECTIONS: Record<Section, React.ReactNode> = {
    dashboard: <DashboardSection />,
    posts: <PostsSection />,
    team: <TeamSection />,
    ads: <AdsSection />,
    notifications: <NotificationsSection />,
    settings: <SettingsSection />,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#030014]">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
            {SECTIONS[active]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
