// Benutzer deaktivieren (sperren) oder wieder aktivieren (nur für Admins)
import { HttpError, UUID_PATTERN, handle } from '../_shared/http.ts';
import { adminClient, requireAdmin } from '../_shared/supabase.ts';

// Sperre "für immer" (100 Jahre)
const BAN_DURATION = '876000h';

Deno.serve(
  handle(async (req, body) => {
    const admin = adminClient();
    const callerId = await requireAdmin(req, admin);

    const userId = String(body.userId ?? '');
    const action = String(body.action ?? '');
    if (!UUID_PATTERN.test(userId)) throw new HttpError(400, 'Ungültige User-ID');
    if (!['activate', 'deactivate'].includes(action)) throw new HttpError(400, 'Ungültige Aktion');
    if (userId === callerId) throw new HttpError(400, 'Das eigene Konto kann nicht geändert werden');

    const active = action === 'activate';

    // Zuerst Profil (Trigger schützt den letzten Admin), dann Login sperren/entsperren
    const { error: profileError } = await admin.from('profiles').update({ active }).eq('id', userId);
    if (profileError) throw new HttpError(400, profileError.message);

    const { error } = await admin.auth.admin.updateUserById(userId, { ban_duration: active ? 'none' : BAN_DURATION });
    if (error) throw new HttpError(400, error.message);

    return { ok: true };
  }),
);
