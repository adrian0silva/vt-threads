import * as statsRepo from "@/repositories/stats.repository";

export interface Totals {
  users: number;
  forums: number;
  topics: number;
  posts: number;
}

export async function getTotals(): Promise<Totals> {
  const [users, forums, topics, posts] = await Promise.all([
    statsRepo.getCountUsers(),
    statsRepo.getCountForums(),
    statsRepo.getCountThreads(),
    statsRepo.getCountPosts(),
  ]);
  return { users, forums, topics, posts };
}
