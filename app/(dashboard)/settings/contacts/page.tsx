import { createContactAction, deleteContactAction, getContactsAction } from "@/actions/contacts";
import { getAreasAction } from "@/actions/areas";

type Area = { id: string; name: string };
type Contact = {
  id: string;
  full_name: string;
  phone: string;
  areas: { name?: string } | null;
};

export default async function ContactsPage() {
  const [contacts, areas] = await Promise.all([getContactsAction(), getAreasAction()]);

  return (
    <section className="space-y-4 rounded-xl border bg-white p-4">
      <h2 className="text-xl font-semibold">Contactos</h2>

      <form action={createContactAction} className="grid gap-2 md:grid-cols-4">
        <input name="full_name" required placeholder="Nombre" className="rounded border p-2" />
        <input name="phone" required placeholder="Teléfono" className="rounded border p-2" />
        <select name="area_id" required className="rounded border p-2">
          <option value="">Selecciona área</option>
          {(areas as Area[]).map((area) => (
            <option key={area.id} value={area.id}>{area.name}</option>
          ))}
        </select>
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Crear contacto</button>
      </form>

      <ul className="space-y-2">
        {(contacts as Contact[]).map((contact) => (
          <li key={contact.id} className="flex items-center justify-between rounded border p-2">
            <div>
              <p className="font-medium">{contact.full_name} · {contact.phone}</p>
              <p className="text-sm text-slate-600">Área: {contact.areas?.name ?? "Sin área"}</p>
            </div>
            <form action={deleteContactAction}>
              <input type="hidden" name="id" value={contact.id} />
              <button className="rounded border border-red-300 px-3 py-1 text-red-700">Eliminar</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
