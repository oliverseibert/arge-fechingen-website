-- Newsletter-Abonnements mit Double-Opt-In

create type public.subscriber_status as enum ('pending', 'confirmed', 'unsubscribed');

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  status public.subscriber_status not null default 'pending',
  -- Für Bestätigungs- und Abmeldelink
  token uuid not null unique default gen_random_uuid(),
  consent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.newsletter_subscribers is 'Schreibzugriff nur über Edge Functions (Service Role)';
comment on column public.newsletter_subscribers.consent_at is 'Zeitpunkt der Einwilligung (Checkbox)';

alter table public.newsletter_subscribers enable row level security;

-- Keine Policies für anon: An- und Abmeldung laufen über Edge Functions mit Service Role
create policy "newsletter_select_admin"
  on public.newsletter_subscribers for select
  to authenticated
  using (public.has_role('admin'));

create policy "newsletter_delete_admin"
  on public.newsletter_subscribers for delete
  to authenticated
  using (public.has_role('admin'));
