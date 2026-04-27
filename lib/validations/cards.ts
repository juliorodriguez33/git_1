import { z } from "zod";

export const updateCardSchema = z.object({
  id: z.string().uuid(),
  statusLight: z.enum(["red", "yellow", "green"]),
  isResolved: z.boolean(),
  lastMessage: z.string().min(0).max(5000)
});
