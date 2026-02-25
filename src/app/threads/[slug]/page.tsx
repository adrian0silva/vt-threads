import { eq, sql } from "drizzle-orm";
import { Clock, MessageSquare, User } from "lucide-react";
import { headers } from "next/headers";

import { ThreadClient } from "@/components/ThreadClientProps";
import { db } from "@/db";
import {
  forumTable,
  postTable,
  threadReadTable,
  threadTable,
  userTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { PostsPagination } from "@/components/posts-pagination";

const DEFAULT_PER = 50;

interface ThreadPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; per?: string }>;
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

export default async function ThreadPage({ params, searchParams }: ThreadPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

  const [thread] = await db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      views: threadTable.views,
      userId: threadTable.userId,
      forumId: threadTable.forumId,
      userName: userTable.name,
      userAvatar: userTable.image,
      createdAt: threadTable.createdAt,
      forumSlug: forumTable.slug,
      forumTitle: forumTable.title,
    })
    .from(threadTable)
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .leftJoin(forumTable, eq(threadTable.forumId, forumTable.id))
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
  await db
    .update(threadTable)
    .set({ views: sql`${threadTable.views} + 1` })
    .where(eq(threadTable.id, thread.id));

  const search = (await (searchParams ?? Promise.resolve({}))) as {
    page?: string;
    per?: string;
  };
  const page = Math.max(1, parseInt(search?.page ?? "1", 10) || 1);
  const per = Math.min(
    100,
    Math.max(1, parseInt(search?.per ?? String(DEFAULT_PER), 10) || DEFAULT_PER),
  );

  const countResult = await db
    .select({ totalCount: sql<number>`count(*)::int` })
    .from(postTable)
    .where(eq(postTable.threadId, thread.id));
  const totalCount = countResult[0]?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / per) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

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
    .limit(per)
    .offset((currentPage - 1) * per)
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
    ...(currentPage === 1 ? [initialPost] : []),
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
    <>
    <ThreadClient
      posts={displayPosts}
      threadId={thread.id}
      threadSlug={slug}
      forumSlug={thread.forumSlug ?? slug}
      forumTitle={thread.forumTitle ?? "Fórum"}
      userId={session?.user?.id || ""}
      isAuthenticated={!!session?.user}
      thread={{
        title: thread.title,
        userName: thread.userName,
        createdAt: thread.createdAt,
      }}
    />
    <PostsPagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalCount}
      per={per}
      basePath={`/threads/${slug}`}
    />
  </>
  );
}