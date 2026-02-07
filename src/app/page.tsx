import { and, eq, sql } from "drizzle-orm";
import { Clock, MessageSquare, PlusIcon, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

import { CreateThread } from "@/components/create-thread";
import { HomeSkeleton } from "@/components/home-skeleton";
import { RightRail } from "@/components/right-rail";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function HomeContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const forums = await db.query.forumTable.findMany({});

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
    .groupBy(
      threadTable.id,
      threadTable.title,
      threadReadTable.lastReadAt,
      threadTable.slug,
      threadTable.description,
      threadTable.views,
      userTable.name,
      userTable.image,
    );
  console.log("threads");
  console.log(threads);
  return (
    <>
      {/* Navigation */}
      <div className="mb-6">
        {session?.user && <CreateThread forums={forums} />}
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

export default function Home() {
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
        <HomeContent />
      </Suspense>
    </main>
  );
}
