import { RenderMode, ServerRoute } from '@angular/ssr';

// News und Termine ändern sich laufend: per SSR rendern und kurz im CDN cachen
const DYNAMIC_HEADERS = {
  'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600',
};

export const serverRoutes: ServerRoute[] = [
  { path: 'neues', renderMode: RenderMode.Server, headers: DYNAMIC_HEADERS },
  { path: 'neues/:slug', renderMode: RenderMode.Server, headers: DYNAMIC_HEADERS },
  { path: 'jubilaeum-2027', renderMode: RenderMode.Server, headers: DYNAMIC_HEADERS },
  // Tokens/Login: nur clientseitig
  { path: 'newsletter/**', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  // Statische Seiten: beim Build vorgerendert
  ...[
    '',
    'die-arge',
    'vorstand',
    'fechingen',
    'vereine',
    'kontakt',
    'impressum',
    'datenschutz',
  ].map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
