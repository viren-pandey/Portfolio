import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { TagData } from './blogData';
import BlogCard from './BlogCard';
import AdSlot from './AdSlot';

interface TagItemProps {
  tag: TagData;
  isOpen: boolean;
  onToggle: () => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, isOpen, onToggle }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  // Smooth-scroll the opened tag into view after the animation starts
  useEffect(() => {
    if (isOpen && itemRef.current) {
      const timer = setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Generous max-height so CSS transition has room; calculated per blog count
  const expandedMaxHeight = tag.blogs.length * 160 + 240;

  return (
    <div
      ref={itemRef}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Tag header / toggle button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150"
        style={{
          borderLeft: isOpen ? '3px solid #6c63ff' : '3px solid transparent',
          background: isOpen ? 'rgba(108,99,255,0.08)' : 'transparent',
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-sm font-medium text-white truncate transition-colors duration-150"
            style={{ color: isOpen ? '#c4baff' : '#ffffff' }}
          >
            {tag.label}
          </span>

          {/* Blog count badge */}
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ background: 'rgba(108,99,255,0.25)', color: '#a89cff' }}
          >
            {tag.blogs.length}
          </span>
        </div>

        {/* Animated chevron */}
        <ChevronDown
          size={14}
          className="flex-shrink-0 text-gray-400 transition-transform duration-300 ease-in-out"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Accordion body — pure CSS max-height + opacity transition */}
      <div
        className="overflow-hidden"
        style={{
          maxHeight: isOpen ? `${expandedMaxHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.35s ease-in-out, opacity 0.25s ease-in-out',
        }}
      >
        <div className="px-3 pt-1 pb-3">
          {tag.blogs.map((blog, index) => (
            <React.Fragment key={blog.id}>
              <BlogCard blog={blog} />
              {/* Ad slot after every 2nd blog card (but not after the last one) */}
              {(index + 1) % 2 === 0 && index < tag.blogs.length - 1 && (
                <AdSlot position="between-blogs" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagItem;
