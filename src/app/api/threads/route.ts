import { db } from "@/db";
import { threadTable } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, forumId, userId } = body;

  if (!title || !description) {
    return new Response(JSON.stringify({ error: "Title and description required" }), { status: 400 });
  }

  const thread = await db.insert(threadTable).values({
    title,
    slug: title,
    description,
    forumId,
    userId,
  });

  return new Response(JSON.stringify(thread));
}