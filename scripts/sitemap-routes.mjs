import { readFileSync } from 'fs';

const DEFAULT_EXCLUDED_PATHS = new Set(['/admin', '/login']);

export function today() {
  return new Date().toISOString().split('T')[0];
}

export function toUrl(siteUrl, { loc, changefreq, priority, lastmod }) {
  return `  <url>
    <loc>${siteUrl}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function inferRouteMeta(loc) {
  if (loc === '/') {
    return { loc, changefreq: 'weekly', priority: '1.0', lastmod: today() };
  }
  if (loc === '/blog') {
    return { loc, changefreq: 'weekly', priority: '0.8', lastmod: today() };
  }
  if (loc === '/projects') {
    return { loc, changefreq: 'weekly', priority: '0.9', lastmod: today() };
  }
  if (loc.startsWith('/project/')) {
    return { loc, changefreq: 'monthly', priority: '0.7', lastmod: today() };
  }
  if (loc === '/contact') {
    return { loc, changefreq: 'monthly', priority: '0.7', lastmod: today() };
  }
  return { loc, changefreq: 'monthly', priority: '0.6', lastmod: today() };
}

export function extractStaticRoutesFromAppSource(source, excludedPaths = DEFAULT_EXCLUDED_PATHS) {
  const routeRegex = /<Route\s+path="([^"]+)"/g;
  const routes = new Set();

  let match = routeRegex.exec(source);
  while (match !== null) {
    const path = match[1].trim();
    if (path.startsWith('/') && !path.includes(':') && path !== '*' && !excludedPaths.has(path)) {
      routes.add(path);
    }
    match = routeRegex.exec(source);
  }

  return Array.from(routes);
}

export function getStaticPagesFromApp(appFilePath) {
  const source = readFileSync(appFilePath, 'utf8');
  const routes = extractStaticRoutesFromAppSource(source);
  return routes.map((loc) => inferRouteMeta(loc));
}

export const FALLBACK_STATIC_PAGES = [
  '/',
  '/blog',
  '/contact',
  '/projects',
  '/project/space-debris-ai',
  '/project/smart-crowd',
  '/project/duality-ai',
].map((loc) => inferRouteMeta(loc));
