import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { users_table } from "./auth.schema";

export const tracks_table = pgTable("tracks", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users_table.id, { onDelete: "cascade" }),
  muxStatus: text("mux_status").$type<MuxStatus>().notNull(),
  muxTrackStatus: text("mux_track_status"),
  muxTrackId: text("mux_track_id").unique(),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),

  title: varchar("title", { length: 255 }).notNull(),
  thumbnail: text("thumbnail"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

const MuxStatus = {
  WAITING: "waiting",
  PREPARING: "preparing",
  READY: "ready",
  ERRORED: "errored",
} as const;

export type MuxStatus = (typeof MuxStatus)[keyof typeof MuxStatus];
