import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { blogData } from './blogData';
import TagItem from './TagItem';
import BlogCard from './BlogCard';
import AdSlot from './AdSlot';

/**
 * TagSidebar — vertical accordion sidebar that groups blog posts by tag.
 *
 * Usage (drop into any layout):
 *   <div className="flex">
 *     <TagSidebar />
 *     <main>…page content…</main>
 *   </div>
 *
 * On mobile (< md breakpoint) the sidebar switches to a horizontal
 * scrollable tag-chip bar. Blog cards expand inline below the chip strip.
 */
const TagSidebar: React.FC = () => {
  const [openTagId, setOpenTagId] = useState<string | null>(null);

  const handleToggle = (tagId: string) => {
    setOpenTagId((prev) => (prev === tagId ? null : tagId));
  };

  const openTag = blogData.find((t) => t.id === openTagId);

  return (
    <>
      {/* ── Desktop sidebar (md+) ──────────────────────────── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 w-64 min-h-screen sticky top-0 self-start max-h-screen overflow-y-auto"
        style={{
          background: '#0f0f1a',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          scrollbarWidth: 'none',
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-4 flex items-center gap-2 sticky top-0 z-10"
          style={{
            background: '#0f0f1a',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <Tag size={13} style={{ color: '#6c63ff' }} />
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            Browse by Tag
          </span>
        </div>

        {/* Top ad slot */}
        <div className="px-3 pt-3">
          <AdSlot position="sidebar-top" />
        </div>

        {/* Tag accordion list */}
        <div className="flex-1">
          {blogData.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              isOpen={openTagId === tag.id}
              onToggle={() => handleToggle(tag.id)}
            />
          ))}
        </div>

        {/* Bottom ad slot */}
        <div className="px-3 pb-4">
          <AdSlot position="sidebar-bottom" />
        </div>
      </aside>

      {/* ── Mobile tag bar (< md) ──────────────────────────── */}
      <div
        className="md:hidden w-full"
        style={{ background: '#0f0f1a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Horizontal scrollable chip strip */}
        <div
          className="flex items-center gap-2 px-4 py-3 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <Tag size={12} style={{ color: '#6c63ff', flexShrink: 0 }} />
          {blogData.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleToggle(tag.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all duration-200"
              style={{
                background:
                  openTagId === tag.id
                    ? 'rgba(108,99,255,0.25)'
                    : 'rgba(255,255,255,0.06)',
                color: openTagId === tag.id ? '#c4baff' : '#9ca3af',
                border:
                  openTagId === tag.id
                    ? '1px solid rgba(108,99,255,0.5)'
                    : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {tag.label}
              <span
                className="text-xs px-1 rounded-full ml-0.5"
                style={{ background: 'rgba(108,99,255,0.3)', color: '#a89cff' }}
              >
                {tag.blogs.length}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile expanded blog cards */}
        {openTag && (
          <div
            className="px-4 pb-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="pt-3">
              {openTag.blogs.map((blog, index, arr) => (
                <React.Fragment key={blog.id}>
                  <BlogCard blog={blog} />
                  {(index + 1) % 2 === 0 && index < arr.length - 1 && (
                    <AdSlot position="between-blogs" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TagSidebar;

