"use server";
import { eq, sql } from "drizzle-orm";
import { Clock, MessageSquare, User } from "lucide-react";
import Link from "next/link";

import { RightRail } from "@/components/right-rail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { postTable, threadTable, userTable } from "@/db/schema";

export default async function Home() {
  // Busca todos os fóruns do banco
  const threads = await db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      createdAt: threadTable.createdAt,
      views: threadTable.views,
      postsCount: sql<number>`COUNT(${postTable.id})`.mapWith(Number),
      userName: userTable.name, // nome do usuário
      userAvatar: userTable.image, // avatar do usuário
    })
    .from(threadTable)
    .leftJoin(postTable, eq(postTable.threadId, threadTable.id))
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .groupBy(
      threadTable.id,
      threadTable.title,
      threadTable.slug,
      threadTable.description,
      threadTable.views,
      userTable.name,
      userTable.image, // precisa entrar no groupBy também
    );
  // Agrupa fóruns por categoria
  // const grouped = categories.map((cat) => ({
  //   ...cat,
  //   forums: forums.filter((f) => f.category === cat.value),
  // }));

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">VT Forums</h1>
          <p className="text-lg text-gray-600">
            Bem-vindo ao nosso fórum de discussão
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Fóruns de Discussão
          </h2>
          <p className="mb-6 text-gray-600">
            Participe de discussões sobre diversos temas. Mantenha o respeito e
            contribua com conteúdo de qualidade.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Conteúdo principal */}
          {threads.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
              <div className="mb-4">
                <MessageSquare className="mx-auto h-16 w-16 text-gray-400" />
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
            <div className="space-y-4">
              {threads.map((thread) => (
                <Card
                  key={thread.id}
                  className="border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      {/* Avatar do autor */}
                      <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                        <Avatar className="h-10 w-10 flex-shrink-0 border border-gray-200 sm:h-12 sm:w-12">
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
                            <h3 className="mb-1 line-clamp-2 text-base font-bold text-gray-900 transition-colors hover:text-blue-600 hover:underline sm:text-lg">
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
                        {/* <div className="text-center">
                        <div className="mb-1 flex items-center gap-1 text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            Visualizações:
                          </span>
                          <span className="sm:hidden">Views:</span>
                        </div>
                        <div className="text-lg font-bold text-gray-700">
                          {thread.views}
                        </div>
                      </div> */}
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
      </main>
    </>
  );
}
