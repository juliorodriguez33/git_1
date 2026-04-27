"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed);
  if (error) throw new Error(error.message);

  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName")
  });

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      data: { full_name: parsed.fullName }
    }
  });

  if (error) throw new Error(error.message);

  if (data.user) {
    await supabase.from("profiles").upsert({ id: data.user.id, full_name: parsed.fullName });
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
