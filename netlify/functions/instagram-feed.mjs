const API_VERSION = 'v25.0';
const POST_LIMIT = 12;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      'Netlify-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET' } });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) return json({ error: 'Instagram feed is not configured yet.' }, 503);

  const endpoint = new URL('https://graph.instagram.com/' + API_VERSION + '/me/media');
  endpoint.searchParams.set('fields', 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp');
  endpoint.searchParams.set('limit', String(POST_LIMIT));
  endpoint.searchParams.set('access_token', accessToken);

  try {
    const upstream = await fetch(endpoint, { signal: AbortSignal.timeout(10000) });
    const payload = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const metaError = payload && payload.error ? payload.error : {};
      console.error('Instagram API request failed', {
        status: upstream.status,
        code: Number.isInteger(metaError.code) ? metaError.code : undefined,
        subcode: Number.isInteger(metaError.error_subcode) ? metaError.error_subcode : undefined,
        type: typeof metaError.type === 'string' ? metaError.type : undefined,
      });
      return json({ error: 'Instagram posts are temporarily unavailable.' }, 502);
    }

    if (!Array.isArray(payload.data)) {
      console.error('Instagram API response did not include a media list', {
        code: Number.isInteger(payload?.error?.code) ? payload.error.code : undefined,
      });
      return json({ error: 'Instagram posts are temporarily unavailable.' }, 502);
    }

    const posts = payload.data
      .filter((post) => post && post.permalink && (post.media_url || post.thumbnail_url))
      .map((post) => ({
        id: String(post.id || ''),
        caption: typeof post.caption === 'string' ? post.caption : '',
        mediaType: typeof post.media_type === 'string' ? post.media_type : 'IMAGE',
        mediaUrl: post.thumbnail_url || post.media_url,
        permalink: post.permalink,
        timestamp: post.timestamp || null,
      }));

    return json({ data: posts });
  } catch (error) {
    console.error('Instagram feed request failed', { name: error?.name || 'Error' });
    return json({ error: 'Instagram posts are temporarily unavailable.' }, 502);
  }
}
