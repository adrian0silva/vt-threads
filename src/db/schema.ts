import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
    "ADMINISTRATOR",
    "MODERATOR",
    "USER"
  ]);

export const userTable = pgTable("user", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    role: roleEnum("role").notNull()
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