// Meldet vom Newsletter ab (Link in jeder E-Mail)
import { HttpError, UUID_PATTERN, handle } from '../_shared/http.ts';
import { adminClient } from '../_shared/supabase.ts';

Deno.serve(
  handle(async (_req, body) => {
    const token = String(body.token ?? '');
    if (!UUID_PATTERN.test(token)) throw new HttpError(400, 'Ungültiger Link');

    const db = adminClient();
    const { data, error } = await db
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('token', token)
      .neq('status', 'unsubscribed')
      .select('id');
    if (error) throw error;

    if (!data.length) {
      // Bereits abgemeldet ist auch ein Erfolg
      const { data: existing } = await db.from('newsletter_subscribers').select('id').eq('token', token).maybeSingle();
      if (!existing) throw new HttpError(404, 'Ungültiger Link');
    }
    return { ok: true };
  }),
);
