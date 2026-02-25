import { aliasedTable } from "drizzle-orm";
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { Clock, MessageSquare, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

import { CreateThread } from "@/components/create-thread";
import { HomeSkeleton } from "@/components/home-skeleton";
import { RightRail } from "@/components/right-rail";
import { ThreadTitleWithPreview } from "@/components/thread-title-with-preview";
import { ThreadsPagination } from "@/components/threads-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import {
  postTable,
  threadReadTable,
  threadTable,
  userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const DEFAULT_PER = 20;
const lastPostUser = aliasedTable(userTable, "last_post_user");
/** Sentinel for leftJoin when no session - never matches any user */
const NO_SESSION_USER_ID = "__no_session__";

type FilterType = "all" | "answered-by-me" | "viewed-by-me" | "unanswered";

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; per?: string; filter?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  const per = Math.min(100, Math.max(1, parseInt(params?.per ?? String(DEFAULT_PER), 10) || DEFAULT_PER));
  const filter = (params?.filter as FilterType) || "all";

  const forums = await db.query.forumTable.findMany({});

  let totalCount: number;
  if (filter === "unanswered") {
    const rows = await db
      .select({ id: threadTable.id })
      .from(threadTable)
      .leftJoin(postTable, eq(postTable.threadId, threadTable.id))
      .groupBy(threadTable.id)
      .having(sql`COUNT(${postTable.id}) = 0`);
    totalCount = rows.length;
  } else if (filter === "answered-by-me" && session?.user?.id) {
    const rows = await db
      .selectDistinct({ threadId: postTable.threadId })
      .from(postTable)
      .where(eq(postTable.userId, session.user.id));
    totalCount = rows.length;
  } else if (filter === "viewed-by-me" && session?.user?.id) {
    const [r] = await db
      .select({ totalCount: sql<number>`count(*)::int` })
      .from(threadReadTable)
      .where(eq(threadReadTable.userId, session.user.id));
    totalCount = r?.totalCount ?? 0;
  } else {
    const [r] = await db
      .select({ totalCount: sql<number>`count(*)::int` })
      .from(threadTable);
    totalCount = r?.totalCount ?? 0;
  }

  const totalPages = Math.ceil(totalCount / per) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  let answeredThreadIds: string[] = [];
  if (filter === "answered-by-me" && session?.user?.id) {
    const answeredRows = await db
      .selectDistinct({ threadId: postTable.threadId })
      .from(postTable)
      .where(eq(postTable.userId, session.user.id));
    answeredThreadIds = answeredRows.map((r) => r.threadId).filter(Boolean);
  }

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
        eq(threadReadTable.userId, session?.user?.id ?? NO_SESSION_USER_ID),
      ),
    );

  const withWhere =
    filter === "answered-by-me" && session?.user?.id
      ? answeredThreadIds.length > 0
        ? baseQuery.where(inArray(threadTable.id, answeredThreadIds))
        : baseQuery.where(sql`1 = 0`)
      : filter === "viewed-by-me" && session?.user?.id
        ? baseQuery.where(isNotNull(threadReadTable.lastReadAt))
        : baseQuery;

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
    lastPostUser.image,
  );

  const withHaving = filter === "unanswered"
    ? withGroupBy.having(sql`COUNT(${postTable.id}) = 0`)
    : withGroupBy;

  const threads = await withHaving
    .orderBy(desc(threadTable.lastPostAt))
    .limit(per)
    .offset((currentPage - 1) * per);

  const basePath = "/";
  const filterParams = (f: string) => (f === "all" ? basePath : `${basePath}?filter=${f}`);

  return (
    <>
      {/* Navigation */}
      <div className="mb-6">
        {session?.user && <CreateThread forums={forums} />}
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={filterParams("all") as never}
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
              href={`${basePath}?filter=answered-by-me`}
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
              href={`${basePath}?filter=viewed-by-me`}
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
          href={`${basePath}?filter=unanswered`}
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

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Conteúdo principal */}
        {threads.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
            <div className="mb-4">
              <MessageSquare className="text-black-400 mx-auto h-16 w-16" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-700">
              Ainda não há tópicos
            </h3>
            <p className="mb-4 text-gray-600">
              Este fórum aguarda seu primeiro tópico de discussão!
            </p>
            <p className="text-sm text-gray-500">
              Seja o primeiro a iniciar uma discussão.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4">
            {threads.map((thread) => (
              <Card
                key={thread.id}
                className="border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Avatar do autor */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                      <Avatar className="h-10 w-10 flex-shrink-0 rounded-none border border-gray-200 sm:h-12 sm:w-12">
                        <AvatarImage
                          src={thread.userAvatar || "/placeholder.svg"}
                          alt={thread.userName || "Usuário"}
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {thread.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="sm:hidden">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-gray-700">
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
                      <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-3">
                        <div className="hidden items-center gap-1 sm:flex">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-gray-700">
                            {thread.userName || "Usuário Anônimo"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(thread.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
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
                    <div className="flex items-center justify-between gap-4 text-sm sm:flex-col sm:gap-6">
                      <div className="text-center">
                        <div className="mb-1 flex items-center gap-1 text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Respostas:</span>
                          <span className="sm:hidden">Resp:</span>
                        </div>
                        <div className="text-lg font-bold text-gray-700">
                          {thread.postsCount}
                        </div>
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
              basePath="/"
              queryParams={filter !== "all" ? { filter } : undefined}
            />
          </div>
        )}

        {/* Barra lateral */}
        <aside className="lg:w-80">
          <RightRail />
        </aside>
      </div>
    </>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; per?: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">VT Forums</h1>
        <p className="text-lg text-gray-600">
          Bem-vindo ao nosso fórum de discussão
        </p>
      </div>
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Fóruns de Discussão
      </h2>
      <p className="mb-6 text-gray-600">
        Participe de discussões sobre diversos temas. Mantenha o respeito e
        contribua com conteúdo de qualidade.
      </p>

      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
