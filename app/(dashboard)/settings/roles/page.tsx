import { createServerSupabaseClient } from "@/lib/supabase/server";

type Role = { id: string; name: string; description: string | null };
type Permission = { id: string; code: string; description: string | null };

export default async function RolesPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: roles }, { data: permissions }] = await Promise.all([
    supabase.from("roles").select("id,name,description").order("name"),
    supabase.from("permissions").select("id,code,description").order("code")
  ]);

  return (
    <section className="space-y-4 rounded-xl border bg-white p-4">
      <h2 className="text-xl font-semibold">Roles y permisos</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-medium">Roles</h3>
          <ul className="space-y-2">
            {((roles ?? []) as Role[]).map((role) => (
              <li key={role.id} className="rounded border p-2">
                <p className="font-medium">{role.name}</p>
                <p className="text-sm text-slate-600">{role.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Permisos</h3>
          <ul className="space-y-2">
            {((permissions ?? []) as Permission[]).map((permission) => (
              <li key={permission.id} className="rounded border p-2">
                <p className="font-medium">{permission.code}</p>
                <p className="text-sm text-slate-600">{permission.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
