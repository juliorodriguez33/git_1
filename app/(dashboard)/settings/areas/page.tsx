import { createAreaAction, deleteAreaAction, getAreasAction } from "@/actions/areas";

type Area = {
  id: string;
  name: string;
  description: string | null;
};

export default async function AreasPage() {
  const areas = (await getAreasAction()) as Area[];

  return (
    <section className="space-y-4 rounded-xl border bg-white p-4">
      <h2 className="text-xl font-semibold">Áreas</h2>

      <form action={createAreaAction} className="grid gap-2 md:grid-cols-3">
        <input name="name" required placeholder="Nombre del área" className="rounded border p-2" />
        <input name="description" placeholder="Descripción" className="rounded border p-2" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Crear área</button>
      </form>

      <ul className="space-y-2">
        {areas.map((area) => (
          <li key={area.id} className="flex items-center justify-between rounded border p-2">
            <div>
              <p className="font-medium">{area.name}</p>
              {area.description ? <p className="text-sm text-slate-600">{area.description}</p> : null}
            </div>
            <form action={deleteAreaAction}>
              <input type="hidden" name="id" value={area.id} />
              <button className="rounded border border-red-300 px-3 py-1 text-red-700">Eliminar</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
