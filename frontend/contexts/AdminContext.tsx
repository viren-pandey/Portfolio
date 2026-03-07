import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp, updateDoc, setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

export type TeamRole = 'writer' | 'editor' | 'manager';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  username: string;
  password: string;
  active: boolean;
  createdAt: string;
}

export interface SiteAd {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'between_posts' | 'corner' | 'sidebar';
  active: boolean;
  createdAt: string;
}

export interface PushNotif {
  id: string;
  title: string;
  body: string;
  url: string;
  sentAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  maintenanceMode: boolean;
  randomNotFound: boolean;
  customNotFoundMsg: string;
  adsenseEnabled: boolean;
  adsenseClient: string;
  adsenseBetweenPostsSlot: string;
  adsenseBlogPostSlot: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Viren Pandey',
  tagline: 'Engineering Blogs',
  maintenanceMode: false,
  randomNotFound: true,
  customNotFoundMsg: '',
  adsenseEnabled: false,
  adsenseClient: '',
  adsenseBetweenPostsSlot: '',
  adsenseBlogPostSlot: '',
};

interface AdminCtxType {
  team: TeamMember[];
  ads: SiteAd[];
  notifications: PushNotif[];
  settings: SiteSettings;
  addTeamMember: (m: Omit<TeamMember, 'id' | 'createdAt'>) => Promise<void>;
  updateTeamMember: (id: string, data: Partial<Omit<TeamMember, 'id'>>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  addAd: (a: Omit<SiteAd, 'id' | 'createdAt'>) => Promise<void>;
  updateAd: (id: string, data: Partial<Omit<SiteAd, 'id'>>) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  sendNotification: (n: Omit<PushNotif, 'id' | 'sentAt'>) => Promise<void>;
  saveSettings: (s: SiteSettings) => Promise<void>;
}

const AdminCtx = createContext<AdminCtxType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [ads, setAds] = useState<SiteAd[]>([]);
  const [notifications, setNotifications] = useState<PushNotif[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const q = query(collection(db, 'team_members'), orderBy('_createdAt', 'desc'));
      return onSnapshot(q, snap =>
        setTeam(snap.docs.map(d => ({ ...d.data(), id: d.id } as TeamMember))),
        err => console.warn('team_members read error:', err.code)
      );
    } catch { return; }
  }, []);

  useEffect(() => {
    try {
      const q = query(collection(db, 'ads'), orderBy('_createdAt', 'desc'));
      return onSnapshot(q, snap =>
        setAds(snap.docs.map(d => ({ ...d.data(), id: d.id } as SiteAd))),
        err => console.warn('ads read error:', err.code)
      );
    } catch { return; }
  }, []);

  useEffect(() => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('_sentAt', 'desc'));
      return onSnapshot(q, snap =>
        setNotifications(snap.docs.map(d => ({ ...d.data(), id: d.id } as PushNotif))),
        err => console.warn('notifications read error:', err.code)
      );
    } catch { return; }
  }, []);

  useEffect(() => {
    try {
      return onSnapshot(
        doc(db, 'site_settings', 'main'),
        snap => { if (snap.exists()) setSettings({ ...DEFAULT_SETTINGS, ...snap.data() } as SiteSettings); },
        err => console.warn('settings read error:', err.code)
      );
    } catch { return; }
  }, []);

  const fmt = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AdminCtx.Provider value={{
      team, ads, notifications, settings,
      addTeamMember: async m => {
        await addDoc(collection(db, 'team_members'), { ...m, createdAt: fmt(), _createdAt: serverTimestamp() });
      },
      updateTeamMember: async (id, data) => { await updateDoc(doc(db, 'team_members', id), data as Record<string, unknown>); },
      deleteTeamMember: async id => { await deleteDoc(doc(db, 'team_members', id)); },
      addAd: async a => {
        await addDoc(collection(db, 'ads'), { ...a, createdAt: fmt(), _createdAt: serverTimestamp() });
      },
      updateAd: async (id, data) => { await updateDoc(doc(db, 'ads', id), data as Record<string, unknown>); },
      deleteAd: async id => { await deleteDoc(doc(db, 'ads', id)); },
      sendNotification: async n => {
        const sentAt = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        await addDoc(collection(db, 'notifications'), { ...n, sentAt, _sentAt: serverTimestamp() });
      },
      saveSettings: async s => { await setDoc(doc(db, 'site_settings', 'main'), s, { merge: true }); },
    }}>
      {children}
    </AdminCtx.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
