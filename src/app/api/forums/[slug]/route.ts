import { eq } from "drizzle-orm"
import type { NextRequest } from "next/server"

import { db } from "@/db"
import { forumTable } from "@/db/schema"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  // Await the params since they're now a Promise in Next.js 15+
  const { slug } = await params
  console.log("slug", slug)

  const forum = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug),
  })

  if (!forum) {
    return new Response(JSON.stringify({ error: "Forum not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify(forum), { headers: { "Content-Type": "application/json" } })
}
