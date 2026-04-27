import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const dailyCards = sqliteTable("daily_cards", {
  id: text("id").primaryKey(),
  cardDate: text("card_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  statusLight: text("status_light").notNull(),
  isResolved: integer("is_resolved", { mode: "boolean" }).notNull().default(false),
  lastMessage: text("last_message"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});
