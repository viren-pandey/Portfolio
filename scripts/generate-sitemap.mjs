/**
 * Sitemap generator — runs as a prebuild step.
 *
 * Fetches published blog posts from Firestore REST API (no SDK needed),
 * then writes public/sitemap.xml so Vite copies it into the build output.
 *
 * Falls back to static-only sitemap if Firestore is unreachable.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://virenp.vercel.app';
const PROJECT_ID = 'studio-730019720-30cd3';
const COLLECTION = 'blog_posts';

// Static pages that are always indexed
const staticPages = [
  { loc: '/',     changefreq: 'weekly',  priority: '1.0', lastmod: today() },
  { loc: '/blog', changefreq: 'weekly',  priority: '0.8', lastmod: today() },
];

function today() {
  return new Date().toISOString().split('T')[0];
}

function toUrl({ loc, changefreq, priority, lastmod }) {
  return `
  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`.trimStart();
}

async function fetchBlogPosts() {
  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}` +
    `?pageSize=200&orderBy=_createdAt%20desc`;

  const res = await fetch(endpoint, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Firestore responded ${res.status}`);

  const json = await res.json();
  const docs = json.documents ?? [];

  return docs.map((doc) => {
    const fields = doc.fields ?? {};
    const permalink = fields.permalink?.stringValue ?? '';
    const updatedAt = doc.updateTime?.split('T')[0] ?? today();
    return { loc: `/blog/${permalink}`, changefreq: 'monthly', priority: '0.6', lastmod: updatedAt };
  }).filter((p) => p.loc !== '/blog/');
}

async function main() {
  let blogPages = [];
  try {
    blogPages = await fetchBlogPosts();
    console.log(`[sitemap] Fetched ${blogPages.length} blog post(s) from Firestore.`);
  } catch (err) {
    console.warn(`[sitemap] Could not fetch blog posts (${err.message}). Using static pages only.`);
  }

  const allPages = [...staticPages, ...blogPages];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(toUrl).join('\n')}
</urlset>
`;

  const outDir = join(__dirname, '..', 'public');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`[sitemap] Written to ${outPath} (${allPages.length} URL(s)).`);
}

main();
