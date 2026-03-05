
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  image?: string;
  author: string;
  permalink: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => void;
  deletePost: (id: string) => void;
  getPostByPermalink: (permalink: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const savedPosts = localStorage.getItem('blog_posts');
    if (!savedPosts) return [];
    const parsed: BlogPost[] = JSON.parse(savedPosts);
    // Migrate old posts that have no permalink
    return parsed.map(p => ({
      ...p,
      permalink: p.permalink || slugify(p.id + '-' + p.title),
    }));
  });

  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (newPostData: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => {
    const newPost: BlogPost = {
      ...newPostData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: `${Math.ceil(newPostData.content.split(' ').length / 200)} min read`,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const getPostByPermalink = (permalink: string) =>
    posts.find(p => p.permalink === permalink);

  return (
    <BlogContext.Provider value={{ posts, addPost, deletePost, getPostByPermalink }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
