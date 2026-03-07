/**
 * Vercel Serverless Function - serves the sitemap at /api/sitemap.
 * Fetches blog posts live from Firestore REST API and returns valid XML.
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  getStaticPagesFromApp,
  FALLBACK_STATIC_PAGES,
  today,
  toUrl,
} from '../scripts/sitemap-routes.mjs';

const SITE_URL = 'https://virenp.vercel.app';
const PROJECT_ID = 'studio-730019720-30cd3';
const COLLECTION = 'blog_posts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROUTES_FILE = join(__dirname, '..', 'frontend', 'App.tsx');

async function fetchBlogPosts() {
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents/${COLLECTION}?pageSize=200`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const json = await res.json();
  const docs = json.documents ?? [];

  return docs
    .map((doc) => {
      const fields = doc.fields ?? {};
      const permalink = fields.permalink?.stringValue ?? '';
      const status = fields.status?.stringValue ?? 'published';
      const lastmod = doc.updateTime?.split('T')[0] ?? today();
      return {
        loc: `/blog/${permalink}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod,
        status,
      };
    })
    .filter((p) => p.loc !== '/blog/' && p.status === 'published')
    .map(({ status, ...page }) => page);
}

export default async function handler(req, res) {
  let staticPages = FALLBACK_STATIC_PAGES;
  try {
    staticPages = getStaticPagesFromApp(APP_ROUTES_FILE);
  } catch (err) {
    console.warn(`[sitemap] Could not parse frontend routes (${err.message}). Using fallback static routes.`);
  }

  let blogPages = [];
  try {
    blogPages = await fetchBlogPosts();
  } catch (_) {
    // Fall back to static pages only.
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...blogPages].map((page) => toUrl(SITE_URL, page)).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
}