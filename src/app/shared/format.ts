import { TIME_ZONE } from '../data/events.service';

const dateFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, day: 'numeric', month: 'long', year: 'numeric' });
const weekdayFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long' });
const timeFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' });
const dateTimeFormat = new Intl.DateTimeFormat('de-DE', { timeZone: TIME_ZONE, dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (iso: string | null | undefined): string => (iso ? dateFormat.format(new Date(iso)) : '');
export const formatWeekday = (iso: string): string => weekdayFormat.format(new Date(iso));
export const formatTime = (iso: string): string => timeFormat.format(new Date(iso));
export const formatDateTime = (iso: string | null | undefined): string => (iso ? dateTimeFormat.format(new Date(iso)) : '–');

/** ISO-String → Wert für <input type="datetime-local"> (lokale Zeit des Browsers). */
export function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/** Wert aus <input type="datetime-local"> → ISO-String (UTC). */
export function fromDateTimeLocal(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

/** Titel → URL-Slug (Umlaute ausgeschrieben). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
