"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const contactSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(7),
  area_id: z.string().uuid()
});

export async function createContactAction(formData: FormData) {
  const payload = contactSchema.parse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    area_id: formData.get("area_id")
  });

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("contacts").insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/settings/contacts");
}

export async function deleteContactAction(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings/contacts");
}

export async function getContactsAction() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id,full_name,phone,area_id,areas(name)")
    .order("full_name");
  if (error) throw new Error(error.message);
  return data ?? [];
}
