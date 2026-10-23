# ARGE Fechingen – Website

Website der ARGE (Arbeitsgemeinschaft) Fechingen unter [arge-fechingen.de](https://arge-fechingen.de).

- **Frontend:** Angular 22 (Standalone Components, Signals, `@if`/`@for`, zoneless), SSR mit Prerendering
- **Backend:** Supabase (Auth, Postgres mit RLS, Storage, Edge Functions)
- **Hosting:** Vercel (Build Output API, eine Node-Function für SSR)
- **E-Mail (Newsletter):** [Resend](https://resend.com) aus den Edge Functions

## Schnellstart

Voraussetzungen: Node.js ≥ 22, npm. Für Supabase lokal zusätzlich [Supabase CLI](https://supabase.com/docs/guides/local-development) und Docker.

```bash
npm ci
cp .env.example .env   # Werte eintragen
npm start              # http://localhost:4200
```

Ohne `SUPABASE_URL`/`SUPABASE_ANON_KEY` läuft die Seite trotzdem; News und Termine bleiben dann leer und der Admin-Bereich zeigt einen Hinweis.

| Befehl                         | Zweck                                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| `npm start`                    | Dev-Server mit SSR                                                 |
| `npm run build`                | Produktions-Build nach `dist/` inkl. Prerendering                  |
| `npm run serve:ssr`            | Gebauten SSR-Server lokal starten (Port 4000)                      |
| `npm run build:vercel`         | Build + Vercel Build Output (`.vercel/output`)                     |
| `npm test`                     | Unit-Tests (Vitest)                                                |
| `npm run lint`                 | ESLint inkl. Template-Barrierefreiheitsregeln                      |
| `npm run supabase:types`       | DB-Typen aus dem Remote-Projekt generieren (`SUPABASE_PROJECT_ID`) |
| `npm run supabase:types:local` | DB-Typen aus der lokalen Supabase-Instanz generieren               |

## Umgebungsvariablen

### Website (Vercel → Project Settings → Environment Variables, lokal `.env`)

| Variable            | Beispiel                       | Beschreibung                                 |
| ------------------- | ------------------------------ | -------------------------------------------- |
| `SUPABASE_URL`      | `https://abcd.supabase.co`     | Projekt-URL (Supabase → Settings → API)      |
| `SUPABASE_ANON_KEY` | `eyJ…` bzw. `sb_publishable_…` | Öffentlicher Anon-/Publishable-Key           |
| `SITE_URL`          | `https://arge-fechingen.de`    | Kanonische Adresse (SEO, Canonical, OG-Tags) |

`scripts/write-env.mjs` schreibt diese Werte vor `start`/`build`/`test` in `src/environments/env.generated.ts` (gitignored). Der Anon-Key ist öffentlich; die Daten schützt RLS. **Der Service-Role-Key gehört nie in die Website**, er wird nur in Edge Functions verwendet.

### Edge Functions (Supabase Secrets)

Vorlage: `supabase/functions/.env.example`. `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY` stellt Supabase automatisch bereit.

| Variable          | Beschreibung                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `SITE_URL`        | Basis für Links in E-Mails (Bestätigen, Abmelden, Einladung)                                     |
| `ALLOWED_ORIGINS` | Kommagetrennte erlaubte Origins für CORS (Standard `*`)                                          |
| `RESEND_API_KEY`  | API-Key von Resend                                                                               |
| `NEWSLETTER_FROM` | Absender, z. B. `ARGE Fechingen <newsletter@arge-fechingen.de>` (Domain bei Resend verifizieren) |

```bash
supabase secrets set --env-file supabase/functions/.env
```

## Supabase einrichten

### Lokal

```bash
supabase start            # Postgres, Auth, Storage, Studio, Inbucket (Mails)
supabase db reset         # Migrationen + supabase/seed.sql einspielen
supabase functions serve  # Edge Functions lokal
npm run supabase:types:local
```

### Remote-Projekt

```bash
supabase login
supabase link --project-ref <projekt-ref>
supabase db push                      # Migrationen aus supabase/migrations
supabase functions deploy             # alle Edge Functions
supabase secrets set --env-file supabase/functions/.env
SUPABASE_PROJECT_ID=<projekt-ref> npm run supabase:types
```

Im Supabase-Dashboard unter **Authentication**:

- **Sign In / Providers → Email:** „Allow new users to sign up“ **deaktivieren** (Benutzer kommen nur per Einladung).
- **URL Configuration:** Site URL `https://arge-fechingen.de`, Redirect URLs `https://arge-fechingen.de/admin/passwort-setzen` (plus ggf. Preview-/Localhost-URLs).
- **Emails:** Vorlagen für „Invite user“ und „Reset password“ auf Deutsch anpassen; für den Produktivbetrieb eigenen SMTP-Server eintragen (die Supabase-Standardmails sind stark limitiert).

### Ersten Admin anlegen

1. Im Dashboard unter **Authentication → Users → Invite user** die eigene E-Mail-Adresse einladen.
2. Im SQL-Editor freischalten:
   ```sql
   update public.profiles set role = 'admin', active = true where email = 'name@example.de';
   ```
3. Einladungslink öffnen, Passwort setzen, unter `/admin` anmelden. Alle weiteren Benutzer lädt man dann über **Admin → Benutzer** ein.

### Migrationen (`supabase/migrations/`)

| Datei                         | Inhalt                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `…01_profiles_roles.sql`      | Enum `app_role`, `profiles`, Trigger bei neuem User, `has_role()`, Schutz des letzten Admins |
| `…02_news_events.sql`         | `news` (Status, Slug, Veröffentlichungsdatum), `events`, Trigger, RLS                        |
| `…03_newsletter.sql`          | `newsletter_subscribers` (pending/confirmed/unsubscribed, Token), RLS                        |
| `…04_storage_news_images.sql` | Bucket `news-images` (öffentlich lesbar, max. 5 MB, nur Bilder) und Policies                 |

**Rechte (RLS):**

| Tabelle                  | anonym                                | content_creator    | admin               |
| ------------------------ | ------------------------------------- | ------------------ | ------------------- |
| `news`                   | lesen, wenn veröffentlicht und fällig | alles              | alles               |
| `events`                 | lesen                                 | alles              | alles               |
| `newsletter_subscribers` | – (nur über Edge Function)            | –                  | lesen, löschen      |
| `profiles`               | –                                     | eigene Zeile lesen | alles lesen, ändern |
| Storage `news-images`    | Public URL                            | hochladen, löschen | hochladen, löschen  |

`has_role(r)` ist `true`, wenn der angemeldete Benutzer **aktiv** ist und die Rolle `r` hat; `admin` erfüllt jede Rolle. Neu angelegte Profile sind inaktiv, bis die Einladung sie freischaltet.

### Edge Functions (`supabase/functions/`)

| Funktion                 | Aufrufer   | Zweck                                                                                               |
| ------------------------ | ---------- | --------------------------------------------------------------------------------------------------- |
| `newsletter-subscribe`   | öffentlich | Speichert als `pending`, sendet Bestätigungsmail (Honeypot, 5-Minuten-Sperre gegen Mehrfachversand) |
| `newsletter-confirm`     | öffentlich | Bestätigt per Token (7 Tage gültig) → `confirmed`                                                   |
| `newsletter-unsubscribe` | öffentlich | Abmeldung per Token → `unsubscribed`                                                                |
| `invite-user`            | nur Admin  | `inviteUserByEmail`, setzt Rolle und schaltet frei                                                  |
| `manage-user`            | nur Admin  | Benutzer deaktivieren (Profil inaktiv + Login gesperrt) bzw. wieder aktivieren                      |

`verify_jwt` ist in `supabase/config.toml` abgeschaltet; die Admin-Funktionen prüfen das JWT und die Rolle selbst (funktioniert auch mit den neuen Publishable Keys). Die Mail-Links zeigen auf `/newsletter/bestaetigen?token=…` bzw. `/newsletter/abmelden?token=…`; erst die Seite ruft die Funktion auf, damit Mail-Scanner, die Links vorab öffnen, nichts auslösen.

## Rendering-Strategie

Definiert in `src/app/app.routes.server.ts`:

- **Prerender (beim Build):** `/`, `/die-arge`, `/vorstand`, `/fechingen`, `/vereine`, `/kontakt`, `/impressum`, `/datenschutz`
- **SSR pro Anfrage** mit `s-maxage=60, stale-while-revalidate=600`: `/neues`, `/neues/:slug`, `/jubilaeum-2027` – neue Beiträge und Termine erscheinen also ohne neues Deployment nach spätestens etwa einer Minute. Daten gehen per `TransferState` an den Browser, damit nach der Hydration nicht doppelt geladen wird.
- **Nur Client:** `/admin/**`, `/newsletter/**`
- Unbekannte Pfade und nicht gefundene Beiträge liefern HTTP 404.

## Deployment (Vercel)

1. Repository in Vercel importieren. `vercel.json` setzt Framework „Other“ und `npm run build:vercel` als Build-Befehl.
2. Environment Variables (siehe oben) für Production und Preview anlegen.
3. Domain `arge-fechingen.de` (und `www`) unter **Settings → Domains** verbinden.

`scripts/vercel-output.mjs` erzeugt aus `dist/` die [Build Output API](https://vercel.com/docs/build-output-api): statische Dateien und vorgerenderte Seiten liegen im CDN, alle übrigen Anfragen gehen an die Function `ssr` (Node 22, `reqHandler` aus `src/server.ts`).

Lokal prüfen: `npm run build:vercel` erzeugt `.vercel/output`; ein Push auf `main` deployt Production, andere Branches erzeugen Preview-Deployments.

## Projektstruktur

```
src/app/
  core/        Supabase-Client, Auth, Guards, SEO, DB-Typen, SSR-Datenübergabe
  data/        News- und Termin-Services
  layout/      Header (Navigation, Burger-Menü), Footer
  shared/      TODO-Platzhalter, Markdown-Pipe, Formatierung
  features/    Seiten (je Ordner), admin/ mit Login und Verwaltung
src/assets/logo/  Logo-Varianten, Wappen, OG-Bild
supabase/         config.toml, migrations/, functions/, seed.sql
scripts/          write-env.mjs, vercel-output.mjs
```

Farben (aus dem Logo) und Typografie stehen als CSS-Variablen in `src/styles.scss`. Es werden bewusst keine externen Webfonts geladen (Datenschutz).

## Offene Inhalte (TODO)

Alle Lücken sind auf der Website als gelbe TODO-Kästen sichtbar:

- **Die ARGE:** Chronik von Günter Nieser
- **Der Vorstand:** Mitglieder, Fotos, Texte, Gruppenbild (Foto: Heiko Lehmann) in `features/vorstand/vorstand.data.ts`
- **Fechingen:** „Über das Dorf“ und „Gänsegretelgeschichte“
- **Vereine:** Daten von Jens in `features/vereine/vereine.data.ts` (Struktur entspricht späteren Tabellen `clubs` / `club_activities`)
- **Jubiläum 2027:** Einleitungstext; Termine über Admin → Termine
- **Impressum** und **Datenschutzerklärung**
- **Logo:** `src/assets/logo/` enthält eine aus der Vorlage zugeschnittene Variante ohne Internetadresse – bei Bedarf durch die Originaldatei ersetzen
