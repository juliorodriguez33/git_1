-- Bootstrap de seguridad y permisos iniciales.

-- 1) Matriz base de permisos por rol.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on true
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
  'cards.create',
  'cards.update',
  'cards.resolve'
)
where r.name = 'operador'
on conflict do nothing;

-- 2) Asegurar que los perfiles actuales sin rol tengan uno por defecto.
update public.profiles p
set role_id = r.id
from public.roles r
where p.role_id is null
  and r.name = 'operador';

-- 3) Si no existe admin aún, promover el primer perfil creado a admin.
with first_profile as (
  select id
  from public.profiles
  order by created_at asc
  limit 1
), admin_role as (
  select id as role_id
  from public.roles
  where name = 'admin'
)
update public.profiles p
set role_id = ar.role_id
from first_profile fp
cross join admin_role ar
where p.id = fp.id
  and not exists (
    select 1
    from public.profiles p2
    join public.roles r2 on r2.id = p2.role_id
    where r2.name = 'admin'
  );

-- 4) Crear perfil automáticamente al registrarse un usuario en auth.users.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_role_id uuid;
  admin_role_id uuid;
  should_be_admin boolean;
begin
  select id into default_role_id
  from public.roles
  where name = 'operador'
  limit 1;

  select id into admin_role_id
  from public.roles
  where name = 'admin'
  limit 1;

  select not exists (
    select 1
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where r.name = 'admin'
  ) into should_be_admin;

  insert into public.profiles (id, full_name, role_id, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when should_be_admin then admin_role_id else default_role_id end,
    true
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        role_id = coalesce(public.profiles.role_id, excluded.role_id),
        is_active = true,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
