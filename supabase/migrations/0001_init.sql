create extension if not exists "uuid-ossp";

create type public.traffic_light as enum ('red', 'yellow', 'green');
create type public.app_role as enum ('admin', 'supervisor', 'operador');

create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  name public.app_role unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role_id uuid references public.roles(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.areas (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  area_id uuid not null references public.areas(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.daily_cards (
  id uuid primary key default uuid_generate_v4(),
  card_date date not null,
  start_time time not null,
  end_time time not null,
  area_id uuid references public.areas(id),
  title text,
  status_light public.traffic_light not null default 'green',
  is_resolved boolean not null default false,
  last_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  unique (card_date, start_time, end_time, area_id)
);

create table if not exists public.novelties (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references public.daily_cards(id) on delete cascade,
  message text not null,
  is_resolved boolean not null default false,
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();
create trigger set_areas_updated_at before update on public.areas
for each row execute function public.touch_updated_at();
create trigger set_contacts_updated_at before update on public.contacts
for each row execute function public.touch_updated_at();
create trigger set_daily_cards_updated_at before update on public.daily_cards
for each row execute function public.touch_updated_at();
create trigger set_novelties_updated_at before update on public.novelties
for each row execute function public.touch_updated_at();

insert into public.roles(name, description) values
('admin', 'Control total de la plataforma'),
('supervisor', 'Gestión operativa y configuración parcial'),
('operador', 'Operación diaria de tarjetas y novedades')
on conflict (name) do nothing;

insert into public.permissions(code, description) values
('dashboard.read', 'Ver panel principal'),
('cards.create', 'Crear tarjetas diarias'),
('cards.update', 'Editar tarjetas diarias'),
('cards.resolve', 'Marcar novedades resueltas'),
('areas.manage', 'Gestionar áreas'),
('contacts.manage', 'Gestionar contactos'),
('users.manage', 'Gestionar usuarios'),
('roles.manage', 'Gestionar permisos')
on conflict (code) do nothing;

create index if not exists idx_daily_cards_date on public.daily_cards(card_date);
create index if not exists idx_daily_cards_resolved on public.daily_cards(is_resolved);
create index if not exists idx_novelties_card on public.novelties(card_id);
create index if not exists idx_contacts_area on public.contacts(area_id);
