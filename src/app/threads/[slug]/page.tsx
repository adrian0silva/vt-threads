import { eq } from "drizzle-orm";
import { ChevronRight, Clock, Eye, MessageSquare, User } from "lucide-react";
import { headers } from "next/headers";

import { ThreadClient } from "@/components/ThreadClientProps";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { postTable, threadTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { parseBBCode } from "@/utils/bbcode-parser";

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

export default async function ThreadPage({ params }: ThreadPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

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
    />
    // <div className="min-h-screen bg-gray-50">
    //   <div className="mx-auto max-w-7xl space-y-6 p-6">
    //     <div className="mb-8 text-center">
    //       <h1 className="text-3xl font-bold text-gray-900">
    //         Tópico de Discussão
    //       </h1>
    //     </div>

    //     <Breadcrumb />
    //     <ThreadHeader thread={thread} />

    //     {displayPosts.length > 0 ? (
    //       <div className="space-y-6">
    //         {displayPosts.map((post) => (
    //           <PostCard key={post.id} post={post} />
    //         ))}
    //       </div>
    //     ) : (
    //       <EmptyState />
    //     )}

    //     <ReplyForm
    //       threadId={thread.id}
    //       userId={session?.user?.id}
    //       isAuthenticated={!!session?.user}
    //       forum={slug}
    //     />

    //     <ThreadStats
    //       views={thread.views || 1247}
    //       repliesCount={displayPosts.length}
    //     />

    //     <div className="mt-8 text-center">
    //       <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    //         <p className="text-xs text-gray-600">
    //           VT Forums - Fórum de Discussão
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
