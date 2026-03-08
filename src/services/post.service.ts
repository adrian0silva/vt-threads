import { db } from "@/db";
import * as postRepo from "@/repositories/post.repository";
import * as threadRepo from "@/repositories/thread.repository";

export async function addReply(
  threadId: string,
  userId: string,
  content: string
): Promise<{ id: string }> {
  return db.transaction(async (tx) => {
    const dbOrTx = tx as unknown as typeof db;
    const result = await postRepo.create(dbOrTx, {
      threadId,
      userId,
      content,
    });
    await threadRepo.updateLastPost(dbOrTx, threadId, userId);
    return result;
  });
}

export interface GetPostsParams {
  threadId: string;
  page: number;
  per: number;
}

export interface GetPostsResult {
  posts: Array<{
    id: string;
    content: string;
    createdAt: Date;
    userName: string | null;
    userAvatar: string | null;
    userId: string;
  }>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getPostsByThreadId(
  params: GetPostsParams
): Promise<GetPostsResult> {
  const { threadId, page, per } = params;
  const { posts, totalCount } = await postRepo.findByThreadIdPaginated(
    db,
    threadId,
    page,
    per
  );
  const totalPages = Math.ceil(totalCount / per) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return { posts, totalCount, totalPages, currentPage };
}
