import { sql } from "drizzle-orm";

import { userTable } from "@/db/schema";

import { db } from "../db";

export async function getTotalUsers() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(userTable);

  return result[0].count;
}
