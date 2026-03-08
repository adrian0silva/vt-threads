import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { postTable, userTable } from "@/db/schema";

type Db = typeof db;

export async function create(
  db: Db,
  data: { threadId: string; userId: string; content: string }
): Promise<{ id: string }> {
  const [row] = await db
    .insert(postTable)
    .values({
      content: data.content,
      threadId: data.threadId,
      userId: data.userId,
    })
    .returning({ id: postTable.id });
  if (!row) throw new Error("Post insert failed");
  return { id: row.id };
}

export async function findByThreadIdPaginated(
  db: Db,
  threadId: string,
  page: number,
  per: number
): Promise<{
  posts: Array<{
    id: string;
    content: string;
    createdAt: Date;
    userName: string | null;
    userAvatar: string | null;
    userId: string;
  }>;
  totalCount: number;
}> {
  const [countRow] = await db
    .select({ totalCount: sql<number>`count(*)::int` })
    .from(postTable)
    .where(eq(postTable.threadId, threadId));
  const totalCount = countRow?.totalCount ?? 0;

  const posts = await db
    .select({
      id: postTable.id,
      content: postTable.content,
      createdAt: postTable.createdAt,
      userName: userTable.name,
      userAvatar: userTable.image,
      userId: postTable.userId,
    })
    .from(postTable)
    .leftJoin(userTable, eq(postTable.userId, userTable.id))
    .where(eq(postTable.threadId, threadId))
    .orderBy(postTable.createdAt)
    .limit(per)
    .offset((page - 1) * per);

  return { posts, totalCount };
}
