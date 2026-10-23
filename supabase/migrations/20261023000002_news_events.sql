-- News und Termine

create type public.news_status as enum ('draft', 'published');
create type public.event_category as enum ('jubilaeum_2027', 'allgemein');

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  teaser text,
  content text not null default '',
  image_path text,
  image_alt text,
  status public.news_status not null default 'draft',
  published_at timestamptz,
  author_id uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint news_published_has_date check (status = 'draft' or published_at is not null)
);

comment on column public.news.content is 'Inhalt als Markdown';
comment on column public.news.image_path is 'Pfad im Storage-Bucket news-images';
comment on column public.news.published_at is 'Veröffentlichungsdatum; in der Zukunft = geplant';

create index news_published_idx on public.news (published_at desc) where status = 'published';

create trigger news_set_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- Beim Veröffentlichen ohne Datum: jetzt
create function public.news_set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger news_set_published_at
  before insert or update of status on public.news
  for each row execute function public.news_set_published_at();

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  category public.event_category not null default 'jubilaeum_2027',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (ends_at is null or ends_at >= starts_at)
);

create index events_category_starts_at_idx on public.events (category, starts_at);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.news enable row level security;
alter table public.events enable row level security;

-- News: öffentlich nur veröffentlichte (und fällige), Redaktion alles
create policy "news_select_published"
  on public.news for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy "news_select_editors"
  on public.news for select
  to authenticated
  using (public.has_role('content_creator'));

create policy "news_insert_editors"
  on public.news for insert
  to authenticated
  with check (public.has_role('content_creator'));

create policy "news_update_editors"
  on public.news for update
  to authenticated
  using (public.has_role('content_creator'))
  with check (public.has_role('content_creator'));

create policy "news_delete_editors"
  on public.news for delete
  to authenticated
  using (public.has_role('content_creator'));

-- Termine: öffentlich alle lesen, Redaktion schreibt
create policy "events_select_all"
  on public.events for select
  to anon, authenticated
  using (true);

create policy "events_insert_editors"
  on public.events for insert
  to authenticated
  with check (public.has_role('content_creator'));

create policy "events_update_editors"
  on public.events for update
  to authenticated
  using (public.has_role('content_creator'))
  with check (public.has_role('content_creator'));

create policy "events_delete_editors"
  on public.events for delete
  to authenticated
  using (public.has_role('content_creator'));
