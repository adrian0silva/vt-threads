import { aliasedTable } from "drizzle-orm";
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { Clock, Eye, MessageSquare, PlusIcon, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ForumSkeleton } from "@/components/forum-skeleton";
import { ThreadTitleWithPreview } from "@/components/thread-title-with-preview";
import { ThreadsPagination } from "@/components/threads-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import {
  forumTable,
  postTable,
  threadReadTable,
  threadTable,
  userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const DEFAULT_PER = 10;
const lastPostUser = aliasedTable(userTable, "last_post_user");

type FilterType = "all" | "answered-by-me" | "viewed-by-me" | "unanswered";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; per?: string; filter?: string }>;
}

async function ForumContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; per?: string; filter?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { slug } = await params;
  const search = (await (searchParams ?? Promise.resolve({}))) as {
    page?: string;
    per?: string;
    filter?: string;
  };
  const page = Math.max(1, parseInt(search?.page ?? "1", 10) || 1);
  const per = Math.min(
    100,
    Math.max(1, parseInt(search?.per ?? String(DEFAULT_PER), 10) || DEFAULT_PER),
  );
  const filter = (search?.filter as FilterType) || "all";

  const forumEncontrado = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug),
  });

  if (!forumEncontrado?.id) {
    return notFound();
  }

  const forumWhere = eq(threadTable.forumId, forumEncontrado.id);

  let totalCount: number;
  if (filter === "unanswered") {
    const rows = await db
      .select({ id: threadTable.id })
      .from(threadTable)
      .leftJoin(postTable, eq(postTable.threadId, threadTable.id))
      .where(forumWhere)
      .groupBy(threadTable.id)
      .having(sql`COUNT(${postTable.id}) = 0`);
    totalCount = rows.length;
  } else if (filter === "answered-by-me" && session?.user?.id) {
    const rows = await db
      .selectDistinct({ threadId: postTable.threadId })
      .from(postTable)
      .innerJoin(threadTable, eq(postTable.threadId, threadTable.id))
      .where(and(eq(postTable.userId, session.user.id), forumWhere));
    totalCount = rows.length;
  } else if (filter === "viewed-by-me" && session?.user?.id) {
    const rows = await db
      .select({ threadId: threadReadTable.threadId })
      .from(threadReadTable)
      .innerJoin(threadTable, eq(threadReadTable.threadId, threadTable.id))
      .where(and(eq(threadReadTable.userId, session.user.id), forumWhere));
    totalCount = rows.length;
  } else {
    const [r] = await db
      .select({ totalCount: sql<number>`count(*)::int` })
      .from(threadTable)
      .where(forumWhere);
    totalCount = r?.totalCount ?? 0;
  }

  const totalPages = Math.ceil(totalCount / per) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  let answeredThreadIds: string[] = [];
  if (filter === "answered-by-me" && session?.user?.id) {
    const answeredRows = await db
      .selectDistinct({ threadId: postTable.threadId })
      .from(postTable)
      .innerJoin(threadTable, eq(postTable.threadId, threadTable.id))
      .where(and(eq(postTable.userId, session.user.id), forumWhere));
    answeredThreadIds = answeredRows.map((r) => r.threadId).filter(Boolean);
  }

  const filterWhere =
    filter === "answered-by-me" && session?.user?.id
      ? answeredThreadIds.length > 0
        ? and(forumWhere, inArray(threadTable.id, answeredThreadIds))
        : and(forumWhere, sql`1 = 0`)
      : filter === "viewed-by-me" && session?.user?.id
        ? and(forumWhere, isNotNull(threadReadTable.lastReadAt))
        : forumWhere;

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
        eq(threadReadTable.userId, session?.user?.id || ""),
      ),
    )
    .where(filterWhere);

  const withGroupBy = baseQuery.groupBy(
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
    lastPostUser.image,
  );

  const withHaving =
    filter === "unanswered"
      ? withGroupBy.having(sql`COUNT(${postTable.id}) = 0`)
      : withGroupBy;

  const threads = await withHaving
    .orderBy(desc(threadTable.lastPostAt))
    .limit(per)
    .offset((currentPage - 1) * per);

  return (
    <>
      {/* Forum Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {forumEncontrado.title}
            </h1>
            <p className="text-sm text-purple-100 sm:text-base">
              {forumEncontrado.description}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{totalCount} Tópicos</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {threads.reduce(
                    (sum: number, t: { postsCount: number }) => sum + t.postsCount,
                    0,
                  )}{" "}
                  Mensagens
                </span>
              </div>
            </div>
          </div>
          {session?.user && (
            <Link href={`/forums/${slug}/post-thread`}>
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 font-medium text-white shadow-lg hover:from-orange-600 hover:to-red-600 sm:px-6 sm:py-3"
                size="lg"
              >
                <PlusIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Criar Tópico</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={`/forums/${slug}` as never}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium",
            filter === "all"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          Todos
        </Link>
        {session?.user && (
          <>
            <Link
              href={`/forums/${slug}?filter=answered-by-me` as never}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                filter === "answered-by-me"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              Respondidos por mim
            </Link>
            <Link
              href={`/forums/${slug}?filter=viewed-by-me` as never}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                filter === "viewed-by-me"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              Visualizadas por mim
            </Link>
          </>
        )}
        <Link
          href={`/forums/${slug}?filter=unanswered` as never}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium",
            filter === "unanswered"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          Sem respostas
        </Link>
      </div>

      {/* Threads List */}
      {threads.length === 0 ? (
        <div className="border-black-200 bg-black-50 rounded-lg border py-12 text-center">
          <div className="mb-4">
            <MessageSquare className="text-black-400 mx-auto h-16 w-16" />
          </div>
          <h3 className="text-black-700 mb-2 text-xl font-bold">
            Ainda não há tópicos
          </h3>
          <p className="text-black-600 mb-4">
            Este fórum aguarda seu primeiro tópico de discussão!
          </p>
          <p className="text-black-500 text-sm">
            Seja o primeiro a iniciar uma discussão.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {threads.map((thread: (typeof threads)[number]) => (
            <Card
              key={thread.id}
              className="border-black-200 hover:border-black-300 border bg-white transition-all duration-300 hover:shadow-md"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* Avatar do autor */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                    <Avatar className="border-black-200 h-10 w-10 flex-shrink-0 rounded-none border sm:h-12 sm:w-12">
                      <AvatarImage
                        src={thread.userAvatar || "/placeholder.svg"}
                        alt={thread.userName || "Usuário"}
                      />
                      <AvatarFallback className="bg-black-100 text-black-600">
                        {thread.title.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="sm:hidden">
                      <div className="text-black-500 flex items-center gap-1 text-xs">
                        <User className="h-3 w-3" />
                        <span className="text-black-700 font-medium">
                          {thread.userName || "Usuário Anônimo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo principal */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2">
                      <ThreadTitleWithPreview
                        title={thread.title}
                        description={thread.description}
                        slug={thread.slug}
                        isUnread={thread.isUnread}
                      />
                    </div>
                    <div className="text-black-500 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-3">
                      <div className="hidden items-center gap-1 sm:flex">
                        <User className="h-3 w-3" />
                        <span className="text-black-700 font-medium">
                          {thread.userName || "Usuário Anônimo"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {thread.postsCount > 0 && thread.lastPostAt && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>
                            Última resposta
                            {thread.lastPostUserName
                              ? ` por ${thread.lastPostUserName}`
                              : ""}{" "}
                            em{" "}
                            {new Date(thread.lastPostAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="flex items-center gap-3 text-sm">
                    {/* Respostas */}
                    <div className="text-black-500 flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Respostas:</span>
                      <span className="sm:hidden">Resp:</span>
                      <span className="text-black-700 text-lg font-bold">
                        {thread.postsCount}
                      </span>
                    </div>

                    {/* Visualizações */}
                    <div className="text-black-500 flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Visualizações:</span>
                      <span className="sm:hidden">Views:</span>
                      <span className="text-black-700 text-lg font-bold">
                        {thread.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <ThreadsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            per={per}
            basePath={`/forums/${slug}`}
            queryParams={filter !== "all" ? { filter } : undefined}
          />
        </div>
      )}
    </>
  );
}

const ForumDetailsPage = async ({
  params,
  searchParams,
}: ForumPageProps) => {
  return (
    <div className="bg-black-50 min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-black-900 text-2xl font-bold sm:text-3xl">
            VT Forums
          </h1>
        </div>
        <Suspense fallback={<ForumSkeleton />}>
          <ForumContent params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default ForumDetailsPage;
