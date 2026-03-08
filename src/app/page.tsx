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

      {/* Filtros estilo Principia */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={filterParams("all") as never}
          className={cn(
            "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
            filter === "all"
              ? "bg-foreground text-background"
              : "bg-card text-foreground hover:bg-muted",
          )}
        >
          Todos
        </Link>
        {session?.user && (
          <>
            <Link
              href={`${basePath}?filter=answered-by-me`}
              className={cn(
                "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
                filter === "answered-by-me"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted",
              )}
            >
              Respondidos por mim
            </Link>
            <Link
              href={`${basePath}?filter=viewed-by-me`}
              className={cn(
                "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
                filter === "viewed-by-me"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted",
              )}
            >
              Visualizadas por mim
            </Link>
          </>
        )}
        <Link
          href={`${basePath}?filter=unanswered`}
          className={cn(
            "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
            filter === "unanswered"
              ? "bg-foreground text-background"
              : "bg-card text-foreground hover:bg-muted",
          )}
        >
          Sem respostas
        </Link>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Conteúdo principal */}
        {threads.length === 0 ? (
          <div className="bg-muted/50 border-border rounded-lg border py-12 text-center">
            <div className="mb-4">
              <MessageSquare className="text-muted-foreground mx-auto h-16 w-16" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-bold">
              Ainda não há tópicos
            </h3>
            <p className="text-muted-foreground mb-4">
              Este fórum aguarda seu primeiro tópico de discussão!
            </p>
            <p className="text-muted-foreground text-sm">
              Seja o primeiro a iniciar uma discussão.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4">
            {threads.map((thread) => (
              <Card
                key={thread.id}
                className="chaos-card bg-card transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Avatar do autor */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                      <Avatar className="border-border h-10 w-10 flex-shrink-0 rounded-none border sm:h-12 sm:w-12">
                        <AvatarImage
                          src={thread.userAvatar || "/placeholder.svg"}
                          alt={thread.userName || "Usuário"}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {thread.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="sm:hidden">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-foreground">
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
                      <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-3">
                        <div className="hidden items-center gap-1 sm:flex">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-foreground">
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

                    {/* Estatísticas — Principia */}
                    <div className="flex items-center justify-between gap-4 text-sm sm:flex-col sm:gap-6">
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1 flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Respostas:</span>
                          <span className="sm:hidden">Resp:</span>
                        </div>
                        <div className="text-foreground text-lg font-bold">
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
      {/* Header erisiano */}
      <div className="mb-8 text-center">
        <h1 className="chaos-heading mb-2 text-4xl font-bold md:text-5xl">VT Forums</h1>
        <p className="text-muted-foreground text-lg">
          Bem-vindo ao fórum
        </p>
        <p className="text-accent mt-1 text-sm font-medium uppercase tracking-widest">
          All Hail Eris! All Hail Discordia!
        </p>
      </div>
      <h2 className="text-foreground mb-4 text-2xl font-bold">
        Fóruns de Discussão
      </h2>
      <p className="text-muted-foreground mb-6">
        Participe de discussões sobre diversos temas. Mantenha o respeito e
        contribua com conteúdo de qualidade.
      </p>

      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
