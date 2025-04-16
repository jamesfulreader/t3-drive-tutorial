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
  id: uuid("id").primaryKey().defaultRandom(), // Consider aligning with Supabase Auth user IDs if applicable
  email: text("email").notNull(),
});

// --- Folders Table ---
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Self-referencing issue
  parentFolderId: uuid("parent_folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Files Table ---
export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  url: text("url"),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Relation inference issue
  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// --- Relations ---
export const usersRelations = relations(users, ({ many }) => ({
  ownedFolders: many(folders, { relationName: "folderOwner" }),
  ownedFiles: many(files, { relationName: "fileAuthor" }),
}));

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Relation inference issue
export const foldersRelations = relations(folders, ({ one, many }) => ({
  owner: one(users, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access 
    fields: [folders.ownerId],
    references: [users.id],
    relationName: "folderOwner",
  }),
  parentFolder: one(folders, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Relation inference issue
    fields: [folders.parentFolderId],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access 
    references: [folders.id],
    relationName: "childFolders",
  }),
  childFolders: many(folders, {
    relationName: "childFolders",
  }),
  files: many(files, {
    relationName: "folderFiles",
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Relation inference issue
export const filesRelations = relations(files, ({ one }) => ({
  author: one(users, {
    fields: [files.authorId],
    references: [users.id],
    relationName: "fileAuthor",
  }),
  folder: one(folders, {
    fields: [files.folderId],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access 
    references: [folders.id],
    relationName: "folderFiles",
  }),
}));
