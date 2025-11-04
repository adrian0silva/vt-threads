import { eq } from "drizzle-orm"
import type { NextRequest } from "next/server"

import { db } from "@/db"
import { forumTable } from "@/db/schema"

export async function GET(req: NextRequest) {

  const forums = await db.query.forumTable.findMany()

  if (!forums) {
    return new Response(JSON.stringify({ error: "Forums not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify(forums), { headers: { "Content-Type": "application/json" } })
}
