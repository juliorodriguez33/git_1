import { createAreaAction, deleteAreaAction, getAreasAction } from "@/actions/areas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Area = {
  id: string;
  name: string;
  description: string | null;
};

export default async function AreasPage() {
  const [areas, supabase] = await Promise.all([getAreasAction(), createServerSupabaseClient()]);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("roles(name)")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const roleName = (myProfile as { roles?: { name?: string } | null } | null)?.roles?.name ?? "sin rol";

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Áreas</h2>
        <p className="text-sm text-slate-600">
          Rol detectado: <span className="font-semibold uppercase text-indigo-700">{roleName}</span>. Si ves error al crear,
          ejecuta la migración 0005 para permisos de operador.
        </p>
      </div>

      <form action={createAreaAction} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-3">
        <input
          name="name"
          required
          placeholder="Nombre del área"
          className="rounded-md border border-slate-200 p-2 outline-none ring-indigo-200 focus:ring"
        />
        <input
          name="description"
          placeholder="Descripción"
          className="rounded-md border border-slate-200 p-2 outline-none ring-indigo-200 focus:ring"
        />
        <button className="rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 px-3 py-2 font-medium text-white shadow-sm">
          Crear área
        </button>
      </form>

      <ul className="space-y-2">
        {(areas as Area[]).map((area) => (
          <li key={area.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
            <div>
              <p className="font-semibold text-slate-900">{area.name}</p>
              {area.description ? <p className="text-sm text-slate-600">{area.description}</p> : null}
            </div>
            <form action={deleteAreaAction}>
              <input type="hidden" name="id" value={area.id} />
              <button className="rounded-md border border-rose-200 px-3 py-1 text-rose-700 transition hover:bg-rose-50">
                Eliminar
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
