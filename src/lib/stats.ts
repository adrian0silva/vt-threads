import { sql } from "drizzle-orm";

import { forumTable, postTable, threadTable, userTable } from "@/db/schema";

import { db } from "../db";

export async function getTotalUsers() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(userTable);

  return result[0].count;
}

export async function getTotalForums() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(forumTable);

  return result[0].count;
}

export async function getTotalTopics() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(threadTable);

  return result[0].count;
}

export async function getTotalPosts() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(postTable);

  return result[0].count;
}