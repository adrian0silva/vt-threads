import * as forumRepo from "@/repositories/forum.repository";
import type { Forum } from "@/types/forum";

export async function listForums(): Promise<Forum[]> {
  return forumRepo.findAll();
}

export async function getForumBySlug(slug: string): Promise<Forum | null> {
  return forumRepo.findBySlug(slug);
}
