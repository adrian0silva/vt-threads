import { aliasedTable } from "drizzle-orm";
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  forumTable,
  postTable,
  threadReadTable,
  threadTable,
  userTable,
} from "@/db/schema";
import type { FilterType } from "@/types/filters";
import type { ThreadBySlug, ThreadListItem } from "@/types/thread";

type Db = typeof db;

const lastPostUser = aliasedTable(userTable, "last_post_user");
const NO_SESSION_USER_ID = "__no_session__";

export async function findBySlug(slug: string): Promise<ThreadBySlug | null> {
  const [row] = await db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      views: threadTable.views,
      userId: threadTable.userId,
      forumId: threadTable.forumId,
      userName: userTable.name,
      userAvatar: userTable.image,
      createdAt: threadTable.createdAt,
      forumSlug: forumTable.slug,
      forumTitle: forumTable.title,
    })
    .from(threadTable)
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .leftJoin(forumTable, eq(threadTable.forumId, forumTable.id))
    .where(eq(threadTable.slug, slug))
    .limit(1);

  return row as ThreadBySlug | null;
}

export interface FindManyPaginatedOptions {
  forumId?: string;
  filter: FilterType;
  sessionUserId: string | null;
  page: number;
  per: number;
}

export async function findManyPaginated(
  options: FindManyPaginatedOptions
): Promise<{ threads: ThreadListItem[]; totalCount: number }> {
  const { forumId, filter, sessionUserId, page, per } = options;
  const effectiveUserId = sessionUserId ?? NO_SESSION_USER_ID;

  const forumWhere = forumId
    ? eq(threadTable.forumId, forumId)
    : undefined;

  let totalCount: number;
  if (filter === "unanswered") {
    const baseUnanswered = db
      .select({ id: threadTable.id })
      .from(threadTable)
      .leftJoin(postTable, eq(postTable.threadId, threadTable.id));
    const rows = forumWhere
      ? await baseUnanswered.where(forumWhere).groupBy(threadTable.id).having(sql`COUNT(${postTable.id}) = 0`)
      : await baseUnanswered.groupBy(threadTable.id).having(sql`COUNT(${postTable.id}) = 0`);
    totalCount = rows.length;
  } else if (filter === "answered-by-me" && sessionUserId) {
    const answeredWhere = forumWhere
      ? and(eq(postTable.userId, sessionUserId), forumWhere)
      : eq(postTable.userId, sessionUserId);
    const rows = await db
      .selectDistinct({ threadId: postTable.threadId })
      .from(postTable)
      .innerJoin(threadTable, eq(postTable.threadId, threadTable.id))
      .where(answeredWhere);
    totalCount = rows.length;
  } else if (filter === "viewed-by-me" && sessionUserId) {
    const viewedWhere = forumWhere
      ? and(eq(threadReadTable.userId, sessionUserId), forumWhere)
      : eq(threadReadTable.userId, sessionUserId);
    const viewedQuery = db
      .select({ totalCount: sql<number>`count(*)::int` })
      .from(threadReadTable)
      .innerJoin(threadTable, eq(threadReadTable.threadId, threadTable.id))
      .where(viewedWhere);
    const [r] = await viewedQuery;
    totalCount = r?.totalCount ?? 0;
  } else {
    const [r] = forumWhere
      ? await db
          .select({ totalCount: sql<number>`count(*)::int` })
          .from(threadTable)
          .where(forumWhere)
      : await db.select({ totalCount: sql<number>`count(*)::int` }).from(threadTable);
    totalCount = r?.totalCount ?? 0;
  }

  let answeredThreadIds: string[] = [];
  if (filter === "answered-by-me" && sessionUserId) {
    const answeredWhere = forumWhere
      ? and(eq(postTable.userId, sessionUserId), forumWhere)
      : eq(postTable.userId, sessionUserId);
    const rows = await db
      .selectDistinct({ threadId: postTable.threadId })
      .from(postTable)
      .innerJoin(threadTable, eq(postTable.threadId, threadTable.id))
      .where(answeredWhere);
    answeredThreadIds = rows.map((r) => r.threadId).filter(Boolean);
  }

  const filterWhere =
    filter === "answered-by-me" && sessionUserId
      ? answeredThreadIds.length > 0
        ? forumWhere
          ? and(forumWhere, inArray(threadTable.id, answeredThreadIds))
          : inArray(threadTable.id, answeredThreadIds)
        : forumWhere
          ? and(forumWhere, sql`1 = 0`)
          : sql`1 = 0`
      : filter === "viewed-by-me" && sessionUserId
        ? forumWhere
          ? and(forumWhere, isNotNull(threadReadTable.lastReadAt))
          : isNotNull(threadReadTable.lastReadAt)
        : forumWhere ?? undefined;

  const baseQuery = db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      createdAt: threadTable.createdAt,
      views: threadTable.views,
      lastPostAt: threadTable.lastPostAt,
      postsCount: sql<number>`COUNT(${postTable.id})`.mapWith(Number),
      lastReadAt: threadReadTable.lastReadAt,
      isUnread: sql<boolean>`
        ${threadReadTable.lastReadAt} IS NULL
        OR ${threadReadTable.lastReadAt} < ${threadTable.lastPostAt}
      `,
      userName: userTable.name,
      userAvatar: userTable.image,
      lastPostUserName: lastPostUser.name,
      lastPostUserAvatar: lastPostUser.image,
    })
    .from(threadTable)
    .leftJoin(postTable, eq(postTable.threadId, threadTable.id))
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .leftJoin(lastPostUser, eq(threadTable.lastPostUserId, lastPostUser.id))
    .leftJoin(
      threadReadTable,
      and(
        eq(threadReadTable.threadId, threadTable.id),
        eq(threadReadTable.userId, effectiveUserId)
      )
    );

  const withWhere = filterWhere ? baseQuery.where(filterWhere) : baseQuery;
  const withGroupBy = withWhere.groupBy(
    threadTable.id,
    threadTable.title,
    threadReadTable.lastReadAt,
    threadTable.slug,
    threadTable.description,
    threadTable.views,
    threadTable.lastPostAt,
    userTable.name,
    userTable.image,
    lastPostUser.name,
    lastPostUser.image
  );
  const withHaving =
    filter === "unanswered"
      ? withGroupBy.having(sql`COUNT(${postTable.id}) = 0`)
      : withGroupBy;

  const threads = await withHaving
    .orderBy(desc(threadTable.lastPostAt))
    .limit(per)
    .offset((page - 1) * per);

  return { threads: threads as ThreadListItem[], totalCount };
}

export async function create(
  data: {
    title: string;
    slug: string;
    description: string;
    forumId: string;
    userId: string;
  }
): Promise<{ id: string }> {
  const [row] = await db
    .insert(threadTable)
    .values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      forumId: data.forumId,
      userId: data.userId,
    })
    .returning({ id: threadTable.id });
  if (!row) throw new Error("Thread insert failed");
  return { id: row.id };
}

export async function updateLastPost(
  dbOrTx: Db,
  threadId: string,
  userId: string
): Promise<void> {
  await dbOrTx
    .update(threadTable)
    .set({
      lastPostAt: new Date(),
      lastPostUserId: userId,
    })
    .where(eq(threadTable.id, threadId));
}

export async function incrementViews(threadId: string): Promise<void> {
  await db
    .update(threadTable)
    .set({ views: sql`${threadTable.views} + 1` })
    .where(eq(threadTable.id, threadId));
}

export async function markThreadAsRead(
  threadId: string,
  userId: string
): Promise<void> {
  await db
    .insert(threadReadTable)
    .values({
      userId,
      threadId,
      lastReadAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [threadReadTable.userId, threadReadTable.threadId],
      set: { lastReadAt: new Date() },
    });
}
