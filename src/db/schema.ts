import { boolean, index, integer, pgTable, text, timestamp, uuid, date } from "drizzle-orm/pg-core";

export const santa = pgTable("santa", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  exchangeDate: date("exchange_date").notNull(),
  budget: integer("budget").notNull(),
  currency: text("currency").notNull().default("EUR"),
  message: text("message").notNull().default(""),
  organizerName: text("organizer_name").notNull(),
  organizerEmail: text("organizer_email").notNull(),
  organizerTokenHash: text("organizer_token_hash").notNull().unique(),
  drawnAt: timestamp("drawn_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const participant = pgTable(
  "participant",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    santaId: uuid("santa_id").notNull().references(() => santa.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    tokenHash: text("token_hash").unique(),
    emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("participant_santa_idx").on(t.santaId)],
);

export const assignment = pgTable(
  "assignment",
  {
    santaId: uuid("santa_id").notNull().references(() => santa.id, { onDelete: "cascade" }),
    giverId: uuid("giver_id").primaryKey().references(() => participant.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id").notNull().references(() => participant.id, { onDelete: "cascade" }),
  },
  (t) => [index("assignment_receiver_idx").on(t.receiverId)],
);

/** A participant's letter to Santa. Readable only by the owner and by the person who drew them. */
export const wishlist = pgTable("wishlist", {
  participantId: uuid("participant_id").primaryKey().references(() => participant.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Anonymous chat between a giver and their receiver. One thread per assignment, keyed by the giver. */
export const message = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    giverId: uuid("giver_id").notNull().references(() => participant.id, { onDelete: "cascade" }),
    fromGiver: boolean("from_giver").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("message_thread_idx").on(t.giverId, t.createdAt)],
);
