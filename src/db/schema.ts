import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
    "ADMINISTRATOR",
    "MODERATOR",
    "USER"
  ]);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    name: text().notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
    role: roleEnum("role").notNull().default("USER"),
    createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const categoryTable = pgTable("category", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    slug: text().notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const categoryRelations = relations(categoryTable, ({many}) => ({
    forums: many(forumTable),
}));

export const forumTable = pgTable("forum", {
    id: uuid().primaryKey().defaultRandom(),
    categoryId: uuid('category_id').notNull().references(() => categoryTable.id),
    title: text().notNull(),
    slug: text().notNull().unique(),
    description: text().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const forumRelations = relations(forumTable, ({one}) => {
    return {
        category: one(categoryTable, {
            fields: [forumTable.categoryId],
            references: [categoryTable.id]
        })
    }
})

// Auth tables required by BetterAuth Drizzle adapter
export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" })
});

export const accountTable = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
});