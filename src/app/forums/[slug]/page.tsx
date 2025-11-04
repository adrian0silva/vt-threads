import { eq, sql } from "drizzle-orm";
import { Clock, Eye, MessageSquare, PlusIcon, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { forumTable, postTable, threadTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

const ForumDetailsPage = async ({ params }: ForumPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { slug } = await params;

  const forumEncontrado = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug),
  });

  if (!forumEncontrado?.id) {
    return notFound();
  }

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
    .where(eq(threadTable.forumId, forumEncontrado.id))
    .groupBy(
      threadTable.id,
      threadTable.title,
      threadTable.slug,
      threadTable.description,
      threadTable.views,
      userTable.name,
      userTable.image, // precisa entrar no groupBy também
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            VT Forums
          </h1>
        </div>

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
                  <span>{threads.length} Tópicos</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>
                    {threads.reduce((sum, t) => sum + t.postsCount, 0)}{" "}
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

        {/* Threads List */}
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
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                          {thread.description}
                        </p>
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
                            {new Date(thread.createdAt).toLocaleDateString()}
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
                      <div className="text-center">
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
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-600">
              VT Forums - Fórum de Discussão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetailsPage;
