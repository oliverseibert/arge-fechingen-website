// Newsletter-Anmeldung: speichert als "pending" und schickt die Double-Opt-In-Mail
import { EMAIL_PATTERN, HttpError, handle, siteUrl } from '../_shared/http.ts';
import { adminClient } from '../_shared/supabase.ts';
import { escapeHtml, sendMail } from '../_shared/mail.ts';

// Erneuter Versand frühestens nach dieser Zeit (Schutz vor Mail-Bombing)
const RESEND_COOLDOWN_MS = 5 * 60 * 1000;

Deno.serve(
  handle(async (_req, body) => {
    // Honeypot gefüllt → Bot; still "Erfolg" melden
    if (String(body.website ?? '').trim()) return { ok: true };

    const email = String(body.email ?? '')
      .trim()
      .toLowerCase();
    if (!EMAIL_PATTERN.test(email) || email.length > 254)
      throw new HttpError(400, 'Ungültige E-Mail-Adresse');
    if (body.consent !== true) throw new HttpError(400, 'Einwilligung fehlt');

    const db = adminClient();
    const { data: existing, error: selectError } = await db
      .from('newsletter_subscribers')
      .select('id, status, consent_at')
      .eq('email', email)
      .maybeSingle();
    if (selectError) throw selectError;

    // Bereits bestätigt: keine Mail, gleiche Antwort (verrät nicht, wer angemeldet ist)
    if (existing?.status === 'confirmed') return { ok: true };
    if (
      existing?.status === 'pending' &&
      existing.consent_at &&
      Date.now() - new Date(existing.consent_at).getTime() < RESEND_COOLDOWN_MS
    ) {
      return { ok: true };
    }

    const token = crypto.randomUUID();
    const now = new Date().toISOString();
    const { error: upsertError } = await db.from('newsletter_subscribers').upsert(
      {
        email,
        status: 'pending',
        token,
        consent_at: now,
        confirmed_at: null,
        unsubscribed_at: null,
      },
      { onConflict: 'email' },
    );
    if (upsertError) throw upsertError;

    const confirmUrl = `${siteUrl()}/newsletter/bestaetigen?token=${token}`;
    const unsubscribeUrl = `${siteUrl()}/newsletter/abmelden?token=${token}`;

    const mail = sendMail({
      to: email,
      subject: 'Bitte bestätigen Sie Ihre Newsletter-Anmeldung – ARGE Fechingen',
      text: [
        'Hallo,',
        '',
        'vielen Dank für Ihr Interesse am Newsletter der ARGE Fechingen.',
        'Bitte bestätigen Sie Ihre Anmeldung über diesen Link:',
        confirmUrl,
        '',
        'Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach.',
        '',
        `Abmelden: ${unsubscribeUrl}`,
      ].join('\n'),
      html: `
        <p>Hallo,</p>
        <p>vielen Dank für Ihr Interesse am Newsletter der ARGE Fechingen.</p>
        <p>Bitte bestätigen Sie Ihre Anmeldung:</p>
        <p><a href="${escapeHtml(confirmUrl)}" style="display:inline-block;padding:10px 18px;background:#0d4f91;color:#fff;border-radius:6px;text-decoration:none">Anmeldung bestätigen</a></p>
        <p>Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach.</p>
        <p style="font-size:12px;color:#555"><a href="${escapeHtml(unsubscribeUrl)}">Abmelden</a></p>
      `,
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    });

    try {
      await mail;
    } catch (e) {
      // Versand fehlgeschlagen: Cooldown aufheben, damit ein neuer Versuch möglich ist
      await db.from('newsletter_subscribers').update({ consent_at: null }).eq('email', email);
      throw e;
    }

    return { ok: true };
  }),
);
