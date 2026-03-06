const INDEXNOW_KEY = 'de44bbe49cab4cb8b44ef2eaa2bfa324';
const SITE_HOST = 'virenp.vercel.app';

export async function notifyIndexNow(permalinks: string | string[]) {
  const urls = (Array.isArray(permalinks) ? permalinks : [permalinks]).map(
    (slug) => `https://${SITE_HOST}/blog/${slug}`
  );

  // Bing IndexNow
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
    // Non-critical
  }
}
