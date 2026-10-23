// Lädt einen neuen Benutzer per E-Mail ein (nur für Admins)
import { EMAIL_PATTERN, HttpError, handle, siteUrl } from '../_shared/http.ts';
import { adminClient, requireAdmin } from '../_shared/supabase.ts';

const ROLES = ['admin', 'content_creator'];

Deno.serve(
  handle(async (req, body) => {
    const admin = adminClient();
    await requireAdmin(req, admin);

    const email = String(body.email ?? '').trim().toLowerCase();
    const name = String(body.name ?? '').trim() || null;
    const role = String(body.role ?? 'content_creator');
    if (!EMAIL_PATTERN.test(email)) throw new HttpError(400, 'Ungültige E-Mail-Adresse');
    if (!ROLES.includes(role)) throw new HttpError(400, 'Ungültige Rolle');

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { name },
      redirectTo: `${siteUrl()}/admin/passwort-setzen`,
    });
    if (error) {
      const exists = error.status === 422 || /already been registered|already exists/i.test(error.message);
      throw new HttpError(exists ? 409 : 400, exists ? 'Es gibt bereits einen Benutzer mit dieser E-Mail-Adresse' : error.message);
    }

    // Profil wird per Trigger angelegt; hier Rolle setzen und freischalten
    const { error: profileError } = await admin
      .from('profiles')
      .update({ name, role, active: true })
      .eq('id', data.user.id);
    if (profileError) throw profileError;

    return { id: data.user.id };
  }),
);
