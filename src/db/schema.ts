import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMINISTRATOR", "MODERATOR", "USER"]);

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text().notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image").$type<string | null>().default(null),
  role: roleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ENUM de categorias
export const forumCategoryEnum = pgEnum("forum_category", [
  "GAMING",
  "POLITICA",
  "VALE_TUDO",
]);

// Tabela de fóruns hierárquicos
export const forumTable = pgTable("forum", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  // declaramos parentId como coluna, mas sem .references() aqui
  parentId: t.uuid("parent_id").$type<string | null>().default(null),
  category: forumCategoryEnum("category").notNull(),
  title: t.text("title").notNull(),
  slug: t.text("slug").notNull().unique(),
  description: t.text("description").notNull(),
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
}));

// Relações
export const forumRelations = relations(forumTable, ({ one, many }) => ({
  parent: one(forumTable, {
    fields: [forumTable.parentId],
    references: [forumTable.id],
    relationName: "parent_forum",
  }),
  children: many(forumTable, {
    relationName: "parent_forum",
  }),
}));

// Tabela de threads
export const threadTable = pgTable("thread", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  forumId: uuid("forum_id")
    .notNull()
    .references(() => forumTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastPostAt: timestamp("last_post_at").notNull().defaultNow(),
});

export const threadReadTable = pgTable(
  "thread_read",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => threadTable.id, { onDelete: "cascade" }),
    lastReadAt: timestamp("last_read_at").notNull().defaultNow(),
  },
  (t) => ({
    // garante 1 registro por user + thread
    userThreadUnique: unique().on(t.userId, t.threadId),
  }),
);

export const threadReadRelations = relations(threadReadTable, ({ one }) => ({
  user: one(userTable, {
    fields: [threadReadTable.userId],
    references: [userTable.id],
  }),
  thread: one(threadTable, {
    fields: [threadReadTable.threadId],
    references: [threadTable.id],
  }),
}));

// Tabela de posts
export const postTable = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => threadTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relações da thread
export const threadRelations = relations(threadTable, ({ one, many }) => ({
  forum: one(forumTable, {
    fields: [threadTable.forumId],
    references: [forumTable.id],
  }),
  user: one(userTable, {
    fields: [threadTable.userId],
    references: [userTable.id],
  }),
  posts: many(postTable),
}));

// Relações do post
export const postRelations = relations(postTable, ({ one }) => ({
  thread: one(threadTable, {
    fields: [postTable.threadId],
    references: [threadTable.id],
  }),
  user: one(userTable, {
    fields: [postTable.userId],
    references: [userTable.id],
  }),
}));

// Auth tables required by BetterAuth Drizzle adapter
export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const accountTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verificationTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});
