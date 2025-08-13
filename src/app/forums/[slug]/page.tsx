import { eq } from "drizzle-orm";
import { PlusIcon } from 'lucide-react';
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { forumTable, threadTable } from "@/db/schema";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

const ForumDetailsPage = async ({ params }: ForumPageProps) => {
  const { slug } = await params;

  const forumEncontrado = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug),
  });

  if (!forumEncontrado?.id) {
    return notFound();
  }

  const threads = await db.query.threadTable.findMany({
    where: eq(threadTable.forumId, forumEncontrado.id),
  });

  return (
    <>
    <div className="m-8 w-full space-y-8 rounded-lg bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/*  Added header with forum title and create topic button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{forumEncontrado.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{forumEncontrado.description}</p>
          </div>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium"
            size="sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Post thread
          </Button>
        </div>

        {threads.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border rounded-lg bg-gray-50">
            <p className="text-lg font-medium">
              Este fórum não possui tópicos.
            </p>
            <p className="text-sm">
              Seja o primeiro a criar um!
            </p>
          </div>
        ) : (
          threads.map((thread) => (
            <Card
              key={thread.id}
              className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar do autor */}
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage
                      src={thread.userId || "/placeholder.svg"}
                      alt={thread.userId}
                    />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {thread.title.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Conteúdo principal */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
                      {thread.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{thread.title}</span>
                      <span>•</span>
                      <span>{thread.description}</span>
                    </div>
                  </div>

                  {/* Estatísticas */}
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400 mb-1">Replies:</div>
                      <div className="text-white font-medium">qualqur coisa</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 mb-1">Views:</div>
                      <div className="text-white font-medium">start to panic</div>
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
