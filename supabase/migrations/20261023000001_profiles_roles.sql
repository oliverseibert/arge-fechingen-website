-- Rollen, Profile und Helper-Funktion has_role()

create type public.app_role as enum ('admin', 'content_creator');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  role public.app_role not null default 'content_creator',
  -- Neue Profile sind inaktiv, bis ein Admin sie (per Einladung) freischaltet
  active boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil und Rolle je Benutzer (1:1 zu auth.users)';
comment on column public.profiles.active is 'false = deaktiviert, hat keine Rechte';

alter table public.profiles enable row level security;

-- true, wenn der aktuelle Benutzer aktiv ist und die Rolle hat; admin erfüllt jede Rolle
create function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.active
      and (p.role = required_role or p.role = 'admin')
  );
$$;

revoke execute on function public.has_role(public.app_role) from public;
grant execute on function public.has_role(public.app_role) to anon, authenticated, service_role;

-- Profil automatisch anlegen, wenn ein Auth-User entsteht
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, nullif(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- E-Mail im Profil aktuell halten
create function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- Verhindert, dass der letzte aktive Admin entfernt oder herabgestuft wird
create function public.ensure_active_admin_remains()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'admin' and old.active
     and (tg_op = 'DELETE' or new.role <> 'admin' or not new.active)
     and not exists (
       select 1 from public.profiles
       where id <> old.id and role = 'admin' and active
     ) then
    raise exception 'Es muss mindestens ein aktiver Admin bestehen bleiben';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger ensure_active_admin_remains
  before update of role, active or delete on public.profiles
  for each row execute function public.ensure_active_admin_remains();

-- RLS: eigene Zeile lesen, Admin alles
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.has_role('admin'));

create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

create policy "profiles_delete_admin"
  on public.profiles for delete
  to authenticated
  using (public.has_role('admin'));

-- Generischer Trigger für updated_at
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
