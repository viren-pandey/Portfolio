
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp, updateDoc, increment,
} from 'firebase/firestore';
import { db } from '../firebase';

export type PostStatus = 'pending' | 'published' | 'rejected' | 'archive_requested' | 'archived' | 'delete_requested';

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
  views: number;
  impressions: number;
  status: PostStatus;
  submittedBy?: string;
  reviewNote?: string;
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
  loading: boolean;
  error: string | null;
  addPost: (post: Omit<BlogPost, 'id' | 'date' | 'readTime' | 'views' | 'impressions'>) => Promise<void>;
  updatePost: (id: string, post: Omit<BlogPost, 'id' | 'date' | 'readTime' | 'views' | 'impressions'>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostByPermalink: (permalink: string) => BlogPost | undefined;
  incrementViews: (id: string) => Promise<void>;
  incrementImpressions: (id: string) => Promise<void>;
  approvePost: (id: string) => Promise<void>;
  rejectPost: (id: string, note: string) => Promise<void>;
  archivePost: (id: string) => Promise<void>;
  confirmArchive: (id: string) => Promise<void>;
  unarchivePost: (id: string) => Promise<void>;
  requestDeletePost: (id: string) => Promise<void>;
  cancelDeleteRequest: (id: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const POSTS_COLLECTION = 'blog_posts';

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener — updates on every device instantly
  useEffect(() => {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('_createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: BlogPost[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id:              d.id,
            title:           data.title        ?? '',
            excerpt:         data.excerpt       ?? '',
            content:         data.content       ?? '',
            date:            data.date          ?? '',
            readTime:        data.readTime      ?? '',
            tags:            data.tags          ?? [],
            image:           data.image         ?? '',
            author:          data.author        ?? '',
            permalink:       data.permalink     ?? slugify(d.id),
            metaTitle:       data.metaTitle     ?? '',
            metaDescription: data.metaDescription ?? '',
            keywords:        data.keywords      ?? [],
            views:           data.views         ?? 0,
            impressions:     data.impressions   ?? 0,
            status:          (data.status       ?? 'published') as PostStatus,
            submittedBy:     data.submittedBy   ?? '',
            reviewNote:      data.reviewNote    ?? '',
          } as BlogPost;
        });
        setPosts(fetched);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore error:', err.code, err.message);
        setError(err.code);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const addPost = async (newPostData: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => {
    const wordCount = newPostData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
    await addDoc(collection(db, POSTS_COLLECTION), {
      ...newPostData,
      date:      new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime:  `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
      _createdAt: serverTimestamp(),
    });
  };

  const updatePost = async (id: string, updatedData: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => {
    const wordCount = updatedData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      ...updatedData,
      readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
      _updatedAt: serverTimestamp(),
    });
  };

  const deletePost = async (id: string) => {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
  };

  const getPostByPermalink = (permalink: string) =>
    posts.find(p => p.permalink === permalink);

  const incrementViews = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), { views: increment(1) });
  };

  const incrementImpressions = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), { impressions: increment(1) });
  };

  const approvePost = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      status: 'published',
      reviewNote: '',
      _approvedAt: serverTimestamp(),
    });
  };

  const rejectPost = async (id: string, note: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      status: 'rejected',
      reviewNote: note,
      _rejectedAt: serverTimestamp(),
    });
  };

  // Archive flow: manager requests → admin confirms
  const archivePost = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      status: 'archive_requested',
      _archiveRequestedAt: serverTimestamp(),
    });
  };

  const confirmArchive = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      status: 'archived',
      _archivedAt: serverTimestamp(),
    });
  };

  const unarchivePost = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      status: 'published',
      _unarchivedAt: serverTimestamp(),
    });
  };

  const requestDeletePost = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      status: 'delete_requested',
      _deleteRequestedAt: serverTimestamp(),
    });
  };

  const cancelDeleteRequest = async (id: string) => {
    await updateDoc(doc(db, POSTS_COLLECTION, id), {
      status: 'rejected',
      _deleteRequestCancelledAt: serverTimestamp(),
    });
  };

  return (
    <BlogContext.Provider value={{ posts, loading, error, addPost, updatePost, deletePost, getPostByPermalink, incrementViews, incrementImpressions, approvePost, rejectPost, archivePost, confirmArchive, unarchivePost, requestDeletePost, cancelDeleteRequest }}>
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
