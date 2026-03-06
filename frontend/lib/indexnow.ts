const INDEXNOW_KEY = 'a1b2c3d4e5f6789012345678901234ab';
const SITE_HOST = 'virenp.vercel.app';

export async function notifyIndexNow(permalinks: string | string[]) {
  const urls = (Array.isArray(permalinks) ? permalinks : [permalinks]).map(
    (slug) => `https://${SITE_HOST}/blog/${slug}`
  );

  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Non-critical — silently fail if indexing ping doesn't reach Bing
  }
}
