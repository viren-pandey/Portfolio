import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Blog } from './blogData';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(blog.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleNavigate = () => navigate(`/blog/${blog.permalink}`);

  return (
    <article
      onClick={handleNavigate}
      className="rounded-lg p-3 mb-2 cursor-pointer group transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(108,99,255,0.08)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      {/* Title — max 2 lines */}
      <h4
        className="text-sm font-semibold text-white leading-snug mb-1 group-hover:text-purple-400 transition-colors duration-150"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {blog.title}
      </h4>

      {/* Description — max 2 lines */}
      <p
        className="text-xs text-gray-400 leading-relaxed mb-2"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {blog.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-gray-500 text-xs flex-shrink-0">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {blog.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {formattedDate}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          className="flex items-center gap-1 text-xs font-medium flex-shrink-0 transition-colors duration-150"
          style={{ color: '#a89cff' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c4baff')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a89cff')}
        >
          Read More <ArrowRight size={10} />
        </button>
      </div>
    </article>
  );
};

export default BlogCard;
