import { z } from "zod";

import { db } from "@/db";
import { threadTable } from "@/db/schema";
import { auth } from "@/lib/auth";

function generateSlug(name: string): string {
    const randomString = Math.random().toString(36).substring(2, 7);
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim() + `-${randomString}`;
}

const createThreadSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  forumId: z.string().uuid(),
});

export async function POST(req: Request) {
  const session = await auth.getSession();

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const validation = createThreadSchema.safeParse(body);

  if (!validation.success) {
    return new Response(JSON.stringify({ error: validation.error.errors }), { status: 400 });
  }

  const { title, description, forumId } = validation.data;

  const thread = await db.insert(threadTable).values({
    title,
    slug: generateSlug(title),
    description,
    forumId,
    userId: session.user.id,
  });

  return new Response(JSON.stringify(thread));
}