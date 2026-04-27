"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateCardSchema } from "@/lib/validations/cards";

type DailyCardRow = {
  id: string;
  start_time: string;
  end_time: string;
  status_light: "red" | "yellow" | "green";
  is_resolved: boolean;
  last_message: string | null;
};

export async function updateCardAction(input: unknown) {
  const parsed = updateCardSchema.parse(input);
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("daily_cards")
    .update({
      status_light: parsed.statusLight,
      is_resolved: parsed.isResolved,
      last_message: parsed.lastMessage,
      updated_at: new Date().toISOString()
    })
    .eq("id", parsed.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function getTodayCards() {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("daily_cards")
    .select("id,start_time,end_time,status_light,is_resolved,last_message")
    .eq("card_date", today)
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);

  return ((data ?? []) as DailyCardRow[]).map((card) => ({
    id: card.id,
    startTime: card.start_time,
    endTime: card.end_time,
    statusLight: card.status_light,
    isResolved: card.is_resolved,
    lastMessage: card.last_message ?? ""
  }));
}
