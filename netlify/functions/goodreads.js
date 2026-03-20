// Netlify Function — Goodreads RSS proxy
// Fetches Goodreads RSS feed server-side to bypass CORS restrictions.
// Usage: /.netlify/functions/goodreads?shelf=read&user_id=89441953

const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Portfolio-Bookshelf/1.0' } }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const shelf = params.shelf || 'read';
  const userId = params.user_id || '89441953';

  // Validate inputs (only allow alphanumeric, hyphens)
  if (!/^[\w-]+$/.test(shelf) || !/^\d+$/.test(userId)) {
    return { statusCode: 400, body: 'Invalid parameters' };
  }

  const url = `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}`;

  try {
    const xml = await fetchUrl(url);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // Cache 1 hour
      },
      body: xml
    };
  } catch (err) {
    console.error('Goodreads fetch error:', err.message);
    return {
      statusCode: 502,
      body: `Error fetching Goodreads: ${err.message}`
    };
  }
};
