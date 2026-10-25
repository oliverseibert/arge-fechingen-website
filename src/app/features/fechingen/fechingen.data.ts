// Inhalte der Seite „Fechingen“; Quellen siehe SOURCES

export interface Fact {
  value: string;
  label: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  text: string;
}

export interface Sight {
  title: string;
  text: string;
}

export const FIRST_MENTION_YEAR = 777;
export const JUBILEE_YEAR = 2027;

export const FACTS: Fact[] = [
  { value: '777', label: 'erste urkundliche Erwähnung' },
  { value: '1250', label: 'Jahre Fechingen im Jahr 2027' },
  { value: '8. Jh.', label: 'erste Kapelle auf dem Kirchberg' },
  { value: '1974', label: 'Stadtteil der Landeshauptstadt Saarbrücken' },
];

export const TIMELINE: TimelineEntry[] = [
  {
    year: 'Frühzeit',
    title: 'Altes Siedlungsland',
    text: 'Funde aus der Steinzeit sowie aus keltischer, römischer und merowingischer Zeit zeigen, dass das Fechinger Gebiet sehr früh besiedelt war. Der Ortsname geht auf die alemannische Siedlung „Vecho“ zurück.',
  },
  {
    year: '777',
    title: 'Erste urkundliche Erwähnung',
    text: 'Abt Fulrad vermacht in seinem Testament seine Besitztümer – darunter das Hofgut Fechingen – dem Kloster St. Denis bei Paris.',
  },
  {
    year: '1223',
    title: 'Pfarrei des Stifts St. Arnual',
    text: 'Spätestens ab 1223 ist Fechingen eine der sieben „Stiftspfarreien“ des Stifts St. Arnual. 1295 wird Hellevic, Pfarrer von „Vechingen“, urkundlich genannt.',
  },
  {
    year: '1575',
    title: 'Reformation',
    text: 'In der Grafschaft Saarbrücken wird die Reformation eingeführt. Später bringen der Dreißigjährige Krieg und die Pest die Pfarrei – und beinahe das ganze Dorf – an ihr Ende.',
  },
  {
    year: 'Industriezeit',
    title: 'Vom Bauerndorf zum Arbeiter-Bauerndorf',
    text: 'Mit dem Aufblühen der Halberger Hütte in Brebach arbeiten viele Fechinger in der Industrie und betreiben nebenher Landwirtschaft. 1991/92 geben die letzten hauptberuflichen Landwirte auf.',
  },
  {
    year: '1950–1968',
    title: 'Neue Wohngebiete',
    text: 'Der Hasenberg (ab 1950) und die Nachtweide (1968) werden als Wohngebiete erschlossen – Fechingen behält dabei seinen ländlichen, naturnahen Charakter.',
  },
  {
    year: '1959',
    title: 'Gemeinde Brebach-Fechingen',
    text: 'Die bis dahin eigenständigen Gemeinden Brebach und Fechingen schließen sich zur Gemeinde Brebach-Fechingen zusammen.',
  },
  {
    year: '1974',
    title: 'Teil von Saarbrücken',
    text: 'Mit der saarländischen Gebiets- und Verwaltungsreform wird Brebach-Fechingen am 1. Januar 1974 ein Stadtteil der Landeshauptstadt Saarbrücken.',
  },
  {
    year: '2027',
    title: '1250 Jahre Fechingen',
    text: '1250 Jahre nach der ersten urkundlichen Erwähnung feiert Fechingen sein Jubiläum.',
  },
];

export const SIGHTS: Sight[] = [
  {
    title: 'Gänsegretelbrunnen',
    text: 'Am Fuße des Kirchbergs erinnert der 1985 von der ARGE fertiggestellte Brunnen an die berühmteste Tochter des Dorfes.',
  },
  {
    title: 'Giesebrunnen im Brühl',
    text: 'Um 1800 angelegt und 1997 von der ARGE wieder instand gesetzt.',
  },
  {
    title: 'Wüstungen Benningen und Friedrichingen',
    text: 'Infotafeln des Heimatgeschichtlichen Arbeitskreises zeigen, wo im Mittelalter diese beiden Weiler standen, die später verschwanden.',
  },
  {
    title: 'Fechinger Kombibad',
    text: 'Hallen- und Freibad mit angeschlossener Festhalle – beliebt bei Gästen von beiden Seiten der Grenze.',
  },
];

export const SOURCES = [
  {
    label: 'Landeshauptstadt Saarbrücken: Stadtteilporträt Fechingen (PDF)',
    url: 'https://www.saarbruecken.de/media/download-603518d60491d',
  },
  {
    label: 'Wikipedia: Brebach-Fechingen',
    url: 'https://de.wikipedia.org/wiki/Brebach-Fechingen',
  },
];
