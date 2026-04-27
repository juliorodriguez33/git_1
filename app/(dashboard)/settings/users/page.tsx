import { createServerSupabaseClient } from "@/lib/supabase/server";

type Profile = {
  id: string;
  full_name: string | null;
  roles: { name?: string } | null;
};

export default async function UsersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id,full_name,is_active,roles(name)")
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-4 rounded-xl border bg-white p-4">
      <h2 className="text-xl font-semibold">Usuarios</h2>
      <ul className="space-y-2">
        {((profiles ?? []) as Profile[]).map((profile) => (
          <li key={profile.id} className="rounded border p-2">
            <p className="font-medium">{profile.full_name ?? "Sin nombre"}</p>
            <p className="text-sm text-slate-600">Rol: {profile.roles?.name ?? "Sin rol"}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
