import { and, desc, eq, sql } from "drizzle-orm";
import { Clock, Eye, MessageSquare, PlusIcon, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ForumSkeleton } from "@/components/forum-skeleton";
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

interface ForumPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; per?: string }>;
}

async function ForumContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; per?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { slug } = await params;
  const search = (await (searchParams ?? Promise.resolve({}))) as {
    page?: string;
    per?: string;
  };
  const page = Math.max(1, parseInt(search?.page ?? "1", 10) || 1);
  const per = Math.min(
    100,
    Math.max(1, parseInt(search?.per ?? String(DEFAULT_PER), 10) || DEFAULT_PER),
  );

  const forumEncontrado = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug),
  });

  if (!forumEncontrado?.id) {
    return notFound();
  }

  const countResult = await db
    .select({ totalCount: sql<number>`count(*)::int` })
    .from(threadTable)
    .where(eq(threadTable.forumId, forumEncontrado.id));
  const totalCount = countResult[0]?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / per) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const threads = await db
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
    })
    .from(threadTable)
    .leftJoin(postTable, eq(postTable.threadId, threadTable.id))
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .leftJoin(
      threadReadTable,
      and(
        eq(threadReadTable.threadId, threadTable.id),
        eq(threadReadTable.userId, session?.user?.id || ""),
      ),
    )
    .where(eq(threadTable.forumId, forumEncontrado.id))
    .groupBy(
      threadTable.id,
      threadTable.title,
      threadReadTable.lastReadAt,
      threadTable.slug,
      threadTable.description,
      threadTable.views,
      userTable.name,
      userTable.image,
    )
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
                  {threads.reduce((sum, t) => sum + t.postsCount, 0)} Mensagens
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
          {threads.map((thread) => (
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
                      <Link href={`/threads/${thread.slug}`}>
                        <h3
                          className={cn(
                            "text-black-900 mb-1 line-clamp-2 text-base font-bold transition-colors hover:text-blue-600 hover:underline sm:text-lg",
                            thread.isUnread
                              ? "font-bold text-black"
                              : "font-normal text-gray-600",
                          )}
                        >
                          {thread.title}
                        </h3>
                      </Link>
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
