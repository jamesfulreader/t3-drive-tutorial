import { relations } from "drizzle-orm";
import {
  pgTable,
  pgTableCreator,
  varchar,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";


export const createTable = pgTableCreator((name) => `t3_drive_tutorial_${name}`);

// --- Users Table ---
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Folders Table (Path-based) ---
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  path: text("path").notNull(), // e.g. "/user-id/folder1/subfolder"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Files Table (Path-based) ---
export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  url: text("url").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  path: text("path").notNull(), // e.g. "/user-id/folder1/file.pdf"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// (Optional relations if you still need them)
export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  files: many(files),
}));
