/**
 * Vercel Serverless Function — serves the sitemap at /api/sitemap
 * Fetches blog posts live from Firestore REST API and returns valid XML.
 */

const SITE_URL    = 'https://virenp.vercel.app';
const PROJECT_ID  = 'studio-730019720-30cd3';
const COLLECTION  = 'blog_posts';

function today() {
  return new Date().toISOString().split('T')[0];
}

function toUrl({ loc, changefreq, priority, lastmod }) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

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
      const fields    = doc.fields ?? {};
      const permalink = fields.permalink?.stringValue ?? '';
      const status    = fields.status?.stringValue ?? 'published';
      const lastmod   = doc.updateTime?.split('T')[0] ?? today();
      return { loc: `/blog/${permalink}`, changefreq: 'monthly', priority: '0.6', lastmod, status };
    })
    .filter((p) => p.loc !== '/blog/' && p.status === 'published');
}

export default async function handler(req, res) {
  const staticPages = [
    { loc: '/',     changefreq: 'weekly', priority: '1.0', lastmod: today() },
    { loc: '/blog', changefreq: 'weekly', priority: '0.8', lastmod: today() },
  ];

  let blogPages = [];
  try {
    blogPages = await fetchBlogPosts();
  } catch (_) {
    // fall back to static pages only
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...blogPages].map(toUrl).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
}
