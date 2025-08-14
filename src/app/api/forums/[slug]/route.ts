// app/api/forums/[slug]/route.ts
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { forumTable } from "@/db/schema"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } } // aqui vem o slug corretamente
) {
  const slug = params.slug
  console.log("slug", slug)

  const forum = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug)
  })

  if (!forum) {
    return new Response(JSON.stringify({ error: "Forum not found" }), { status: 404 })
  }

  return new Response(JSON.stringify(forum))
}
