import { headers } from "next/headers";

import { ThreadClient } from "@/components/thread-client-props";
import { PostsPagination } from "@/components/posts-pagination";
import { auth } from "@/lib/auth";
import * as postService from "@/services/post.service";
import * as threadService from "@/services/thread.service";
import type { Post } from "@/types/post";

const DEFAULT_PER = 50;

interface ThreadPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; per?: string }>;
}

export default async function ThreadPage({
  params,
  searchParams,
}: ThreadPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

  const thread = await threadService.getThreadBySlug(slug);
  if (!thread) {
    throw new Error("Thread não encontrada");
  }

  if (session?.user?.id) {
    await threadService.markThreadAsRead(thread.id, session.user.id);
  }
  await threadService.incrementThreadViews(thread.id);

  const search = (await (searchParams ?? Promise.resolve({}))) as {
    page?: string;
    per?: string;
  };
  const page = Math.max(
    1,
    parseInt(search?.page ?? "1", 10) || 1
  );
  const per = Math.min(
    100,
    Math.max(1, parseInt(search?.per ?? String(DEFAULT_PER), 10) || DEFAULT_PER)
  );

  const postsResult = await postService.getPostsByThreadId({
    threadId: thread.id,
    page,
    per,
  });

  const {
    posts: dbPosts,
    totalCount,
    totalPages,
    currentPage,
  } = postsResult;

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

  const displayPosts: Post[] = [
    ...(currentPage === 1 ? [initialPost] : []),
    ...dbPosts.map((post) => ({
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
