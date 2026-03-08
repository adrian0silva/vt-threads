import type { FilterType } from "@/types/filters";
import type { ThreadBySlug, ThreadListItem } from "@/types/thread";
import * as threadRepo from "@/repositories/thread.repository";

function generateSlug(title: string): string {
  const randomString = Math.random().toString(36).substring(2, 7);
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim() + `-${randomString}`
  );
}

export interface ListThreadsParams {
  forumId?: string;
  filter: FilterType;
  page: number;
  per: number;
  sessionUserId: string | null;
}

export interface ListThreadsResult {
  threads: ThreadListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function listThreads(
  params: ListThreadsParams
): Promise<ListThreadsResult> {
  const { forumId, filter, page, per, sessionUserId } = params;
  const { threads, totalCount } = await threadRepo.findManyPaginated({
    forumId,
    filter,
    sessionUserId,
    page,
    per,
  });
  const totalPages = Math.ceil(totalCount / per) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return { threads, totalCount, totalPages, currentPage };
}

export async function getThreadBySlug(slug: string): Promise<ThreadBySlug | null> {
  return threadRepo.findBySlug(slug);
}

export async function getThreadForApi(slug: string): Promise<ThreadBySlug | null> {
  return threadRepo.findBySlug(slug);
}

export async function createThread(data: {
  title: string;
  description: string;
  forumId: string;
  userId: string;
}): Promise<{ id: string }> {
  const slug = generateSlug(data.title);
  return threadRepo.create({
    title: data.title,
    slug,
    description: data.description,
    forumId: data.forumId,
    userId: data.userId,
  });
}

export async function markThreadAsRead(
  threadId: string,
  userId: string
): Promise<void> {
  return threadRepo.markThreadAsRead(threadId, userId);
}

export async function incrementThreadViews(threadId: string): Promise<void> {
  return threadRepo.incrementViews(threadId);
}
