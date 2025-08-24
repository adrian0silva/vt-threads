// app/api/forums/[slug]/route.ts
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"

import { db } from "@/db"
import { forumTable } from "@/db/schema"

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } } // ⚠ correto agora
) {
  const slug = context.params.slug
  console.log("slug", slug)

  const forum = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug)
  })

  if (!forum) {
    return new Response(JSON.stringify({ error: "Forum not found" }), { status: 404 })
  }

  return new Response(JSON.stringify(forum))
}
