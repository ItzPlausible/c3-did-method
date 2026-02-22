export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Redirect /ns/c3/v1 to /ns/c3/v1.jsonld (rewrite, not redirect)
    if (path === '/ns/c3/v1') {
      url.pathname = '/ns/c3/v1.jsonld';
      const newRequest = new Request(url.toString(), request);
      const response = await env.ASSETS.fetch(newRequest);
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          'Content-Type': 'application/ld+json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Custom headers for the JSON-LD context file
    if (path === '/ns/c3/v1.jsonld') {
      const response = await env.ASSETS.fetch(request);
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...Object.fromEntries(response.headers),
          'Content-Type': 'application/ld+json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Everything else: serve from static assets
    return env.ASSETS.fetch(request);
  },
};
