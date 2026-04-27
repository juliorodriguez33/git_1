import Link from "next/link";
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  return (
    <form action={loginAction} className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Iniciar sesión</h1>
      <input name="email" type="email" required placeholder="Email" className="rounded border p-2" />
      <input name="password" type="password" required placeholder="Contraseña" className="rounded border p-2" />
      <button className="rounded bg-slate-900 p-2 text-white">Entrar</button>
      <p className="text-sm text-slate-600">
        ¿No tienes cuenta? <Link href="/register" className="underline">Regístrate</Link>
      </p>
    </form>
  );
}
