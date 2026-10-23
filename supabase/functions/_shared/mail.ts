import { requireEnv } from './http.ts';

export interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

/** Versand über Resend (https://resend.com); Absender-Domain muss dort verifiziert sein. */
export async function sendMail(mail: Mail): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: requireEnv('NEWSLETTER_FROM'), ...mail }),
  });
  if (!response.ok)
    throw new Error(`E-Mail-Versand fehlgeschlagen: ${response.status} ${await response.text()}`);
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
