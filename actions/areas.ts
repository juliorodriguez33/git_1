"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const areaSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(2000).optional()
});

async function assertAreaManagePermission() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesión expirada. Vuelve a iniciar sesión.");

  const { data: allowed, error } = await supabase.rpc("has_permission", {
    uid: user.id,
    permission_code: "areas.manage"
  });

  if (error) throw new Error(error.message);
  if (!allowed) {
    throw new Error("Tu usuario no tiene permiso para crear áreas. Solicita rol admin/supervisor u operador con acceso de gestión.");
  }

  return supabase;
}

export async function createAreaAction(formData: FormData) {
  const payload = areaSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined
  });

  const supabase = await assertAreaManagePermission();
  const { error } = await supabase.from("areas").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/settings/areas");
}

export async function deleteAreaAction(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await assertAreaManagePermission();
  const { error } = await supabase.from("areas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings/areas");
}

export async function getAreasAction() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("areas").select("id,name,description,created_at").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}
