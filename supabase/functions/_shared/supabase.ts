import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HttpError, requireEnv } from './http.ts';

/** Client mit Service Role – umgeht RLS, nur serverseitig verwenden. */
export function adminClient(): SupabaseClient {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Prüft das JWT des Aufrufers und dass er aktiver Admin ist. Gibt die User-ID zurück. */
export async function requireAdmin(req: Request, admin: SupabaseClient): Promise<string> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new HttpError(401, 'Nicht angemeldet');

  const { data: userData, error } = await admin.auth.getUser(token);
  if (error || !userData.user) throw new HttpError(401, 'Nicht angemeldet');

  const { data: profile } = await admin
    .from('profiles')
    .select('role, active')
    .eq('id', userData.user.id)
    .maybeSingle();
  if (profile?.role !== 'admin' || !profile.active) throw new HttpError(403, 'Nur für Admins');

  return userData.user.id;
}
