// Statische Vereinsdaten. Struktur entspricht späteren Supabase-Tabellen `clubs` und `club_activities`.

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const WEEKDAYS: Record<Weekday, string> = {
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
  7: 'Sonntag',
};

export interface Club {
  id: string;
  name: string;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
}

/** Regelmäßiges Training / Probe – club_id verweist auf Club.id */
export interface ClubActivity {
  id: string;
  club_id: string;
  title: string;
  weekday: Weekday;
  /** 'HH:MM' */
  start_time: string;
  end_time: string | null;
  location: string | null;
  /** z. B. 'wöchentlich', 'jeden 1. Freitag im Monat' */
  interval_note: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

// TODO: Daten von Jens eintragen (Platzhalter unten ersetzen)
export const CLUBS: Club[] = [
  {
    id: 'verein-1',
    name: 'TODO: Vereinsname',
    description: 'TODO: Kurzbeschreibung',
    contact_name: 'TODO: Ansprechpartner/in',
    contact_email: null,
    contact_phone: null,
    website: null,
  },
  {
    id: 'verein-2',
    name: 'TODO: Vereinsname',
    description: 'TODO: Kurzbeschreibung',
    contact_name: 'TODO: Ansprechpartner/in',
    contact_email: null,
    contact_phone: null,
    website: null,
  },
];

export const CLUB_ACTIVITIES: ClubActivity[] = [
  {
    id: 'termin-1',
    club_id: 'verein-1',
    title: 'TODO: Training',
    weekday: 2,
    start_time: '19:00',
    end_time: '20:30',
    location: 'TODO: Ort',
    interval_note: 'wöchentlich',
    contact_name: 'TODO: Ansprechpartner/in',
    contact_email: null,
    contact_phone: null,
  },
  {
    id: 'termin-2',
    club_id: 'verein-2',
    title: 'TODO: Probe',
    weekday: 4,
    start_time: '20:00',
    end_time: null,
    location: 'TODO: Ort',
    interval_note: 'wöchentlich',
    contact_name: 'TODO: Ansprechpartner/in',
    contact_email: null,
    contact_phone: null,
  },
];
