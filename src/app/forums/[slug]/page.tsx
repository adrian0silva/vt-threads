import { eq, sql } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
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
    <>
      <div className="m-8 w-full space-y-8 rounded-lg bg-white p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/*  Added header with forum title and create topic button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {forumEncontrado.title}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {forumEncontrado.description}
              </p>
            </div>
            {session?.user && (
              <Link href={`/forums/${slug}/post-thread`}>
                <Button
                  className="bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                  size="sm"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Post thread
                </Button>
              </Link>
            )}
          </div>

          {threads.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 py-12 text-center text-gray-500">
              <p className="text-lg font-medium">
                Este fórum não possui tópicos.
              </p>
              <p className="text-sm">Seja o primeiro a criar um!</p>
            </div>
          ) : (
            threads.map((thread) => (
              <Card
                key={thread.id}
                className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar do autor */}
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage
                        src={thread.userAvatar || "/placeholder.svg"}
                        alt={thread.userName || "User avatar"}
                      />
                      <AvatarFallback className="bg-gray-600 text-white">
                        {thread.title.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Conteúdo principal */}
                    <div className="min-w-0 flex-1">
                      <Link href={`/threads/${thread.slug}`}>
                        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-white">
                          {thread.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{thread.userName}</span>
                        <span>-</span>
                        <span>{JSON.stringify(thread.createdAt)}</span>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="flex items-center gap-6 text-xs">
                      <div className="text-center">
                        <div className="mb-1 text-gray-400">Replies:</div>
                        <div className="font-medium text-white">
                          {thread.postsCount}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="mb-1 text-gray-400">Views:</div>
                        <div className="font-medium text-white">
                          {thread.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ForumDetailsPage;
