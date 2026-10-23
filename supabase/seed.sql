-- Beispieldaten nur für die lokale Entwicklung (`supabase db reset`)
insert into public.news (title, slug, teaser, content, status, published_at)
values
  ('Willkommen auf der neuen Website', 'willkommen', 'Die ARGE Fechingen hat eine neue Website.',
   E'## Beispielbeitrag\n\nDies ist ein **Beispielbeitrag** für die lokale Entwicklung.', 'published', now()),
  ('Entwurf: Noch nicht veröffentlicht', 'entwurf', 'Dieser Beitrag ist ein Entwurf.', 'Nur im Admin sichtbar.', 'draft', null);

insert into public.events (title, description, starts_at, ends_at, location, category)
values
  ('Beispiel: Auftaktveranstaltung', 'Beispieltermin für die lokale Entwicklung.', '2027-01-15 19:00+01', '2027-01-15 22:00+01', 'Fechingen', 'jubilaeum_2027'),
  ('Beispiel: Festwochenende', null, '2027-06-12 10:00+02', '2027-06-13 18:00+02', 'Fechingen', 'jubilaeum_2027');
