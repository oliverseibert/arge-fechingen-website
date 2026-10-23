export interface Vorstandsmitglied {
  name: string;
  funktion: string;
  text: string;
  /** Pfad unter /assets/vorstand/, null = Platzhalter */
  foto: string | null;
}

// TODO: echte Mitglieder, Funktionen, Texte und Fotos eintragen
export const VORSTAND: Vorstandsmitglied[] = [
  { name: 'TODO: Name', funktion: 'TODO: 1. Vorsitz', text: 'TODO: kurzer Vorstellungstext', foto: null },
  { name: 'TODO: Name', funktion: 'TODO: 2. Vorsitz', text: 'TODO: kurzer Vorstellungstext', foto: null },
  { name: 'TODO: Name', funktion: 'TODO: Kasse', text: 'TODO: kurzer Vorstellungstext', foto: null },
  { name: 'TODO: Name', funktion: 'TODO: Schriftführung', text: 'TODO: kurzer Vorstellungstext', foto: null },
];

export const GRUPPENBILD = {
  /** null = Platzhalter, sonst z. B. '/assets/vorstand/gruppenbild.webp' */
  src: null as string | null,
  alt: 'Gruppenbild des Vorstands der ARGE Fechingen',
  credit: 'Heiko Lehmann',
};
