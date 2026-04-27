alter table public.profiles enable row level security;
alter table public.areas enable row level security;
alter table public.contacts enable row level security;
alter table public.daily_cards enable row level security;
alter table public.novelties enable row level security;
alter table public.audit_logs enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.id = uid and r.name = 'admin'
  );
$$;

create or replace function public.has_permission(uid uuid, permission_code text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    join public.role_permissions rp on rp.role_id = p.role_id
    join public.permissions pe on pe.id = rp.permission_id
    where p.id = uid and pe.code = permission_code
  ) or public.is_admin(uid);
$$;

create policy "read own or admin profile" on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

create policy "admin manages profiles" on public.profiles
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "read cards by auth users" on public.daily_cards
for select to authenticated
using (public.has_permission(auth.uid(), 'dashboard.read'));

create policy "edit cards by permission" on public.daily_cards
for all to authenticated
using (public.has_permission(auth.uid(), 'cards.update'))
with check (public.has_permission(auth.uid(), 'cards.update'));

create policy "read novelties by auth users" on public.novelties
for select to authenticated
using (public.has_permission(auth.uid(), 'dashboard.read'));

create policy "write novelties by permission" on public.novelties
for all to authenticated
using (public.has_permission(auth.uid(), 'cards.update'))
with check (public.has_permission(auth.uid(), 'cards.update'));

create policy "read areas" on public.areas
for select to authenticated
using (public.has_permission(auth.uid(), 'dashboard.read'));

create policy "manage areas" on public.areas
for all to authenticated
using (public.has_permission(auth.uid(), 'areas.manage'))
with check (public.has_permission(auth.uid(), 'areas.manage'));

create policy "read contacts" on public.contacts
for select to authenticated
using (public.has_permission(auth.uid(), 'dashboard.read'));

create policy "manage contacts" on public.contacts
for all to authenticated
using (public.has_permission(auth.uid(), 'contacts.manage'))
with check (public.has_permission(auth.uid(), 'contacts.manage'));

create policy "read roles and permissions" on public.roles
for select to authenticated
using (public.has_permission(auth.uid(), 'roles.manage'));

create policy "read permission catalog" on public.permissions
for select to authenticated
using (public.has_permission(auth.uid(), 'roles.manage'));

create policy "read role permission matrix" on public.role_permissions
for select to authenticated
using (public.has_permission(auth.uid(), 'roles.manage'));
