# Ops Control App (Next.js 15 + Supabase)

Aplicación web para operación diaria con autenticación, dashboard de tarjetas por horario, semáforo de criticidad, pendientes persistentes, panel de configuración y sincronización realtime.

## Stack

- Next.js 15 (App Router) + TypeScript estricto
- React Server Components + Server Actions
- Tailwind CSS + lucide-react
- Supabase (PostgreSQL + Auth + Realtime + RLS)
- Zod para validaciones
- Fallback local: Drizzle + SQLite

## Estructura clave

- `app/(auth)` login/registro
- `app/(dashboard)/dashboard` panel diario
- `app/(dashboard)/settings/*` configuración (áreas, contactos, usuarios, roles)
- `actions/*` server actions por dominio
- `hooks/use-realtime-cards.ts` suscripción a cambios
- `supabase/migrations/*` esquema + RLS + realtime

## Configuración local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
SQLITE_URL=
```

## Supabase paso a paso

1. Crear proyecto en https://supabase.com/dashboard.
2. Cargar variables en `.env.local`.
3. Ejecutar en SQL Editor:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_realtime.sql`
4. Habilitar Auth email/password (y Google opcional).
5. Verificar que `daily_cards`, `novelties`, `areas`, `contacts` estén publicadas en realtime.

## Qué incluye este paso final

- Login/registro/logout con Supabase.
- Dashboard diario editable con color semáforo.
- Persistencia de novedades y estado resuelto.
- Panel de pendientes no resueltos.
- Sincronización en vivo (refresh reactivo por cambios en `daily_cards`).
- CRUD inicial funcional de áreas y contactos.
- Vista de usuarios y catálogo de roles/permisos.
- RLS con helper `has_permission(...)` + políticas por permiso.

## Deploy (Vercel recomendado)

1. Push del repositorio a GitHub.
2. Importar proyecto en Vercel.
3. Definir variables de entorno (mismas de `.env.local`).
4. Deploy.

## Pendiente recomendado (siguiente iteración)

- Matriz editable de `role_permissions` desde UI.
- Políticas RLS por área asignada (`profile_areas`).
- Auditoría avanzada con triggers por tabla.
- Tests E2E (Playwright) y unitarios (Vitest).
