-- Seed de matriz de permisos por rol
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'dashboard.read',
  'cards.create',
  'cards.update',
  'cards.resolve',
  'areas.manage',
  'contacts.manage',
  'users.manage',
  'roles.manage'
)
where r.name = 'admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'dashboard.read',
  'cards.create',
  'cards.update',
  'cards.resolve',
  'areas.manage',
  'contacts.manage'
)
where r.name = 'supervisor'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in (
  'dashboard.read',
  'cards.update',
  'cards.resolve'
)
where r.name = 'operador'
on conflict do nothing;

-- Backfill de perfiles sin rol
update public.profiles p
set role_id = r.id
from public.roles r
where p.role_id is null
  and r.name = 'operador';

-- Trigger para crear perfil por defecto al crear usuario en auth.users
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  operator_role_id uuid;
begin
  select id into operator_role_id
  from public.roles
  where name = 'operador'
  limit 1;

  insert into public.profiles (id, full_name, role_id)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), operator_role_id)
  on conflict (id) do update
  set full_name = excluded.full_name,
      role_id = coalesce(public.profiles.role_id, excluded.role_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();
