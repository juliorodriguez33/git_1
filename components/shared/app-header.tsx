import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 p-4">
        <h1 className="text-lg font-semibold">Ops Control</h1>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/settings/areas">Áreas</Link>
          <Link href="/settings/contacts">Contactos</Link>
          <Link href="/settings/users">Usuarios</Link>
          <Link href="/settings/roles">Roles</Link>
        </nav>
      </div>
    </header>
  );
}
