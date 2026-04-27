# Ops Control App (Next.js 15 + Supabase)

Guía **paso a paso** para iniciar el proyecto en:
- **Windows (PowerShell)**
- **WSL Ubuntu (recomendado para desarrollo Node/Next)**

Incluye instalación, Supabase, variables de entorno, migraciones, ejecución local y despliegue.

---

## 0) Qué es este proyecto

Aplicación web operativa con:
- Next.js 15 + TypeScript + App Router
- Supabase (PostgreSQL, Auth, Realtime, RLS)
- Dashboard diario con tarjetas por horario
- CRUD de áreas/contactos y base de roles/permisos

---

## 1) Prerrequisitos

### Cuenta y servicios
1. Cuenta en GitHub.
2. Cuenta en Supabase: https://supabase.com/dashboard.
3. (Opcional) Cuenta en Vercel para deploy.

### Software mínimo
- **Node.js 20 LTS o superior**
- **Git**
- **Editor**: VS Code recomendado

---

## 2) Instalación en Windows (PowerShell)

> Si vas a usar WSL para desarrollar, puedes saltar a la sección 3.

### 2.1 Instalar Node.js
1. Descarga Node.js LTS desde https://nodejs.org.
2. Instala con opciones por defecto.
3. Verifica:

```powershell
node -v
npm -v
```

### 2.2 Instalar Git
1. Instala Git desde https://git-scm.com/download/win.
2. Verifica:

```powershell
git --version
```

### 2.3 Clonar el repositorio
```powershell
git clone <URL_DEL_REPO>
cd <CARPETA_DEL_REPO>
```

### 2.4 Instalar dependencias
```powershell
npm install
```

### 2.5 Configurar variables de entorno
```powershell
copy .env.example .env.local
```

Edita `.env.local` y completa:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` (si usas postgres local)
- `SQLITE_URL` (fallback local)

### 2.6 Ejecutar en local
```powershell
npm run dev
```

Abrir: http://localhost:3000

---

## 3) Instalación en WSL Ubuntu (recomendado)

### 3.1 Instalar WSL (si no lo tienes)
En **PowerShell como Administrador**:

```powershell
wsl --install
```

Reinicia Windows si lo pide. Luego abre Ubuntu.

### 3.2 Actualizar Ubuntu e instalar utilidades
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
```

### 3.3 Instalar Node.js 20 LTS en Ubuntu (nvm recomendado)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v
npm -v
```

### 3.4 Clonar repo dentro del filesystem Linux (importante)
> Recomendado clonar en `~/` (no en `/mnt/c/...`) para mejor rendimiento.

```bash
cd ~
git clone <URL_DEL_REPO>
cd <CARPETA_DEL_REPO>
```

### 3.5 Instalar dependencias
```bash
npm install
```

### 3.6 Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar:
```bash
nano .env.local
```

Completa todas las variables necesarias.

### 3.7 Ejecutar proyecto
```bash
npm run dev
```

Abrir en navegador Windows: http://localhost:3000

---

## 4) Crear y configurar Supabase paso a paso

### 4.1 Crear proyecto
1. Ir a https://supabase.com/dashboard.
2. Click en **New project**.
3. Define nombre, password de DB y región.
4. Espera a que termine el provisionado.

### 4.2 Obtener credenciales
En **Project Settings > API** copia:
- Project URL  → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 4.3 Ejecutar migraciones SQL
En Supabase, abrir **SQL Editor** y correr en orden:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_rls_policies.sql`
3. `supabase/migrations/0003_realtime.sql`

### 4.4 Activar autenticación
En **Authentication > Providers**:
- Habilita **Email** (email/password)
- (Opcional) configura Google OAuth

### 4.5 Realtime
Verifica que estén publicadas las tablas:
- `daily_cards`
- `novelties`
- `areas`
- `contacts`

---

## 5) Primer arranque funcional (checklist)

1. `npm install` ejecutado sin errores.
2. `.env.local` completo.
3. Migraciones aplicadas.
4. `npm run dev` levantado.
5. Prueba:
   - Registro en `/register`
   - Login en `/login`
   - Dashboard `/dashboard`
   - Configuración `/settings/*`

---

## 6) Scripts útiles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

---

## 7) Errores comunes y solución

### Error: `Cannot find module ...` al correr typecheck
- Ejecuta `npm install`.
- Verifica versión de Node (`node -v`).
- Borra lock y reinstala si hace falta:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de conexión a Supabase
- Revisa URL y keys en `.env.local`.
- Reinicia dev server tras cambiar variables.


### Error: `Your project's URL and Key are required to create a Supabase client!`
- Este error aparece cuando Next **no está leyendo variables** de Supabase.
- Asegúrate de usar **`.env.local`** (no `.env.example`).
- Debes tener como mínimo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

- Reinicia completamente el servidor:

```bash
Ctrl + C
npm run dev
```

- En Windows, valida que el archivo se llame exactamente `.env.local` y no `.env.local.txt`.

### App redirige siempre a login
- Revisa Auth provider habilitado.
- Verifica cookies/sesión y políticas RLS.

### Error: `new row violates row-level security policy for table "areas"`
- Significa que el usuario autenticado **no tiene permiso** `areas.manage` según RLS.
- Ejecuta también la migración `supabase/migrations/0004_role_permissions_and_profile_defaults.sql`.
- Si el usuario ya existe, verifica/ajusta rol en `public.profiles.role_id` (supervisor o admin para crear áreas).
- Consulta rápida para diagnóstico:

```sql
select p.id, p.full_name, r.name as role
from public.profiles p
left join public.roles r on r.id = p.role_id
where p.id = auth.uid();
```

### En WSL está lento
- Mueve el repo a `~/` dentro de Linux.
- Evita trabajar en `/mnt/c/...`.

---

## 8) Deploy en Vercel

1. Sube repo a GitHub.
2. En Vercel: **Add New Project**.
3. Importa el repositorio.
4. En Environment Variables agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy.

---

## 9) Variables de entorno (plantilla)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
SQLITE_URL=file:./local.db
```

---

## 10) Recomendación de flujo de trabajo (equipo)

1. Crear rama por feature.
2. Implementar cambios pequeños y commitear frecuente.
3. Ejecutar `npm run typecheck` y `npm run lint` antes de push.
4. Abrir PR con evidencia y pasos de validación.

---

Si quieres, en el siguiente paso te preparo también un **`SETUP_WINDOWS_WSL.md`** separado con capturas y comandos listos para copy/paste por perfil (junior/senior).
