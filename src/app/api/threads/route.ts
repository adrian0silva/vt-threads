import { db } from "@/db";
import { threadTable } from "@/db/schema";

function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, forumId, userId } = body;

  if (!title || !description) {
    return new Response(JSON.stringify({ error: "Title and description required" }), { status: 400 });
  }

  const thread = await db.insert(threadTable).values({
    title,
    slug: generateSlug(title),
    description,
    forumId,
    userId,
  });

  return new Response(JSON.stringify(thread));
}