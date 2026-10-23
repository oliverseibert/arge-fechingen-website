// CORS und JSON-Antworten für alle Edge Functions

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '*').split(',').map((o) => o.trim());

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') ?? '';
  const allow = allowedOrigins.includes('*') ? '*' : allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
  });
}

/** Gemeinsamer Rahmen: CORS-Preflight, nur POST, JSON-Body, Fehlerbehandlung. */
export function handle(fn: (req: Request, body: Record<string, unknown>) => Promise<unknown>) {
  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
    if (req.method !== 'POST') return json(req, { error: 'Methode nicht erlaubt' }, 405);
    try {
      const body = await req.json().catch(() => ({}));
      return json(req, (await fn(req, body)) ?? { ok: true });
    } catch (e) {
      if (e instanceof HttpError) return json(req, { error: e.message }, e.status);
      console.error(e);
      return json(req, { error: 'Interner Fehler' }, 500);
    }
  };
}

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Umgebungsvariable ${name} fehlt`);
  return value;
}

export const siteUrl = () => (Deno.env.get('SITE_URL') ?? 'https://arge-fechingen.de').replace(/\/$/, '');
