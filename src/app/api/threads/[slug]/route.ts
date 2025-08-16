import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { db } from "@/db"
import {  postTable, threadTable } from "@/db/schema"

export async function GET(
  req: Request,
  { params }: { params: { slug: string } } // aqui vem o slug corretamente
) {
  const slug = params.slug
  console.log("slug", slug)

  const thread = await db.query.forumTable.findFirst({
    where: eq(threadTable.slug, slug)
  })

  if (!thread) {
    return new Response(JSON.stringify({ error: "Thread not found" }), { status: 404 })
  }

  return new Response(JSON.stringify(thread))
}


