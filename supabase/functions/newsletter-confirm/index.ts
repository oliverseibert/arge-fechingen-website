// Bestätigt eine Newsletter-Anmeldung (Double-Opt-In) per Token
import { HttpError, UUID_PATTERN, handle } from '../_shared/http.ts';
import { adminClient } from '../_shared/supabase.ts';

// Bestätigungslinks verfallen nach 7 Tagen
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

Deno.serve(
  handle(async (_req, body) => {
    const token = String(body.token ?? '');
    if (!UUID_PATTERN.test(token)) throw new HttpError(400, 'Ungültiger Link');

    const db = adminClient();
    const { data: subscriber, error } = await db
      .from('newsletter_subscribers')
      .select('id, status, consent_at')
      .eq('token', token)
      .maybeSingle();
    if (error) throw error;
    if (!subscriber || subscriber.status === 'unsubscribed')
      throw new HttpError(404, 'Ungültiger Link');
    if (subscriber.status === 'confirmed') return { ok: true };

    const consentAt = subscriber.consent_at ? new Date(subscriber.consent_at).getTime() : 0;
    if (Date.now() - consentAt > TOKEN_TTL_MS) throw new HttpError(410, 'Link abgelaufen');

    const { error: updateError } = await db
      .from('newsletter_subscribers')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', subscriber.id);
    if (updateError) throw updateError;

    return { ok: true };
  }),
);
