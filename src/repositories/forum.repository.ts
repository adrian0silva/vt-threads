import { eq } from "drizzle-orm";

import { db } from "@/db";
import { forumTable } from "@/db/schema";
import type { Forum } from "@/types/forum";

export async function findAll(): Promise<Forum[]> {
  const rows = await db.query.forumTable.findMany({
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
    },
  });
  return rows as Forum[];
}

export async function findBySlug(slug: string): Promise<Forum | null> {
  const row = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
    },
  });
  return row as Forum | null;
}

export async function findById(id: string): Promise<Forum | null> {
  const row = await db.query.forumTable.findFirst({
    where: eq(forumTable.id, id),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
    },
  });
  return row as Forum | null;
}
