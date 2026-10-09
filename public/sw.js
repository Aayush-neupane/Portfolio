/* App-shell service worker: keeps the portfolio (and its custom offline
 * screen) loadable with no connection. Runtime-cached, so no build manifest
 * is needed — the shell and assets are stored as they are fetched.
 * Bump CACHE when this strategy changes. */
const CACHE = 'aayush-portfolio-v1';

// Resolve against the worker's own scope so this works both at the domain
// root (Netlify) and under a subpath (e.g. GitHub Pages /Portfolio/).
const SCOPE_URL = self.registration.scope;
const SHELL_URL = new URL('index.html', SCOPE_URL).toString();
const SCOPE_ROOT = new URL('./', SCOPE_URL).toString();

// Last-resort page: shown only when neither network nor any cached shell
// exists (e.g. the very first visit happens offline). Guarantees a styled
// message instead of the browser's default offline screen or a blank page.
const FALLBACK_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">` +
  `<meta name="viewport" content="width=device-width,initial-scale=1">` +
  `<title>Offline &mdash; Aayush Neupane</title><style>` +
  `body{margin:0;min-height:100vh;display:grid;place-items:center;background:#141210;color:#ece7df;` +
  `font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:24px}` +
  `.t{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#e85854}` +
  `h1{font-size:2rem;margin:12px 0 8px}p{color:#a39e93;font-size:.9rem}` +
  `a{display:inline-block;margin-top:18px;padding:12px 28px;border-radius:999px;` +
  `background:#e85854;color:#fff;text-decoration:none;font-weight:600}</style></head>` +
  `<body><div><div class="t">aayush / offline</div><h1>You&rsquo;re offline.</h1>` +
  `<p>Check your connection, then try again &mdash; everything will be right here.</p>` +
  `<a href="./">Retry connection</a></div></body></html>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([SHELL_URL, SCOPE_ROOT]).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Page loads / refreshes: network first, then cache, then the app shell.
  // The shell boot renders the custom offline screen when still offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches
            .open(CACHE)
            .then((cache) => cache.put(request, copy))
            .catch(() => {});
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((hit) => hit || caches.match(SHELL_URL))
            .then(
              (hit) =>
                hit ||
                new Response(FALLBACK_HTML, {
                  headers: { 'Content-Type': 'text/html' },
                })
            )
        )
    );
    return;
  }

  // Same-origin files (JS, CSS, images, data): serve cached instantly,
  // refresh from network in the background when online.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((hit) => {
        const network = fetch(request)
          .then((res) => {
            if (res && (res.status === 200 || res.type === 'opaque')) {
              const copy = res.clone();
              caches
                .open(CACHE)
                .then((cache) => cache.put(request, copy))
                .catch(() => {});
            }
            return res;
          })
          .catch(() => hit);
        return hit || network;
      })
    );
  }
});
