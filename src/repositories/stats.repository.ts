import { sql } from "drizzle-orm";

import { db } from "@/db";
import { forumTable, postTable, threadTable, userTable } from "@/db/schema";

export async function getCountUsers(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(userTable);
  return result[0].count;
}

export async function getCountForums(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(forumTable);
  return result[0].count;
}

export async function getCountThreads(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(threadTable);
  return result[0].count;
}

export async function getCountPosts(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(postTable);
  return result[0].count;
}
