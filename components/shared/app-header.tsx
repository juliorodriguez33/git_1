import Link from "next/link";
import { logoutAction } from "@/actions/auth";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings/areas", label: "Áreas" },
  { href: "/settings/contacts", label: "Contactos" },
  { href: "/settings/users", label: "Usuarios" },
  { href: "/settings/roles", label: "Roles" }
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 p-4">
        <h1 className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-lg font-bold text-transparent">
          Ops Control
        </h1>

        <div className="flex items-center gap-3">
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form action={logoutAction}>
            <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700">
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
