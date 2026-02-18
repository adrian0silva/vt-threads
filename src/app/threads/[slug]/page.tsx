import { eq } from "drizzle-orm";
import { ChevronRight, Clock, Eye, MessageSquare, User } from "lucide-react";
import { headers } from "next/headers";

import { ThreadClient } from "@/components/ThreadClientProps";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { postTable, threadReadTable, threadTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { parseBBCode } from "@/utils/bbcode-parser";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface ThreadPageProps {
  params: Promise<{ slug: string }>;
}

interface Post {
  id: string;
  author: string;
  title: string;
  joinDate: string;
  posts: string;
  likes: string;
  content: string;
  timestamp: string;
  isOriginalPoster: boolean;
  userAvatar: string | null;
  signature?: string | null;
}

function ThreadHeader({
  thread,
}: {
  thread: { title: string; userName: string | null; createdAt: Date };
}) {
  return (
    <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg md:p-6">
      <h1 className="mb-4 text-xl font-bold break-words md:text-3xl">
        {thread.title}
      </h1>
      <div className="flex flex-col space-y-3 text-sm md:flex-row md:items-center md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Autor:</span>
            <a href="#" className="truncate font-medium hover:underline">
              {thread.userName || "Usuário Anônimo"}
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span className="hidden md:inline">Criado em:</span>
          <span>{new Date(thread.createdAt).toLocaleDateString("pt-BR")}</span>
        </div>
      </div>
    </div>
  );
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

  // Buscar thread
  // Buscar thread
  const [thread] = await db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      views: threadTable.views,
      userId: threadTable.userId,
      userName: userTable.name,
      userAvatar: userTable.image,
      createdAt: threadTable.createdAt,
    })
    .from(threadTable)
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .where(eq(threadTable.slug, slug))
    .limit(1)
    .execute();

  if (!thread) throw new Error("Thread não encontrada");
  if (session?.user?.id) {
    await db
      .insert(threadReadTable)
      .values({
        userId: session.user.id,
        threadId: thread.id,
        lastReadAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [threadReadTable.userId, threadReadTable.threadId],
        set: {
          lastReadAt: new Date(),
        },
      });
  }


  // Buscar posts
  const posts = await db
    .select({
      id: postTable.id,
      content: postTable.content,
      createdAt: postTable.createdAt,
      userName: userTable.name,
      userAvatar: userTable.image,
      userId: postTable.userId,
    })
    .from(postTable)
    .leftJoin(userTable, eq(postTable.userId, userTable.id))
    .where(eq(postTable.threadId, thread.id))
    .orderBy(postTable.createdAt)
    .execute();

  // Criar post inicial do thread
  const initialPost: Post = {
    id: `thread-${thread.id}`,
    author: thread.userName || "Usuário Anônimo",
    title: "Membro",
    joinDate: "Desconhecido",
    posts: "0",
    likes: "0",
    content: thread.description || "",
    timestamp: new Date(thread.createdAt).toLocaleString(),
    isOriginalPoster: true,
    userAvatar: thread.userAvatar,
    signature: "",
  };

  // Mapear posts
  const displayPosts: Post[] = [
    initialPost,
    ...posts.map((post) => ({
      id: post.id,
      author: post.userName || "Usuário Anônimo",
      title: "Membro",
      joinDate: "Desconhecido",
      posts: "0",
      likes: "0",
      content: post.content,
      timestamp: new Date(post.createdAt).toLocaleString(),
      isOriginalPoster: post.userId === thread.userId,
      userAvatar: post.userAvatar,
      signature: undefined,
    })),
  ];

  return (
    <ThreadClient
      posts={displayPosts}
      threadId={thread.id}
      forum={slug}
      userId={session?.user?.id || ""}
      isAuthenticated={!!session?.user}
      thread={{
        title: thread.title,
        userName: thread.userName,
        createdAt: thread.createdAt,
      }}
    />
  );
}