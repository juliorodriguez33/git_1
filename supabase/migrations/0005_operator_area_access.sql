-- Hotfix: permitir que el rol operador gestione Áreas y Contactos
-- para evitar bloqueos operativos cuando no hay matriz editable de roles en UI.

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.code in ('areas.manage', 'contacts.manage')
where r.name = 'operador'
on conflict do nothing;
