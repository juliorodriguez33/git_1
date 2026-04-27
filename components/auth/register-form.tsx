import Link from "next/link";
import { registerAction } from "@/actions/auth";

export function RegisterForm() {
  return (
    <form action={registerAction} className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Crear cuenta</h1>
      <input name="fullName" required placeholder="Nombre completo" className="rounded border p-2" />
      <input name="email" type="email" required placeholder="Email" className="rounded border p-2" />
      <input name="password" type="password" required placeholder="Contraseña" className="rounded border p-2" />
      <button className="rounded bg-slate-900 p-2 text-white">Registrar</button>
      <p className="text-sm text-slate-600">
        ¿Ya tienes cuenta? <Link href="/login" className="underline">Ingresar</Link>
      </p>
    </form>
  );
}
