import { NextResponse } from "next/server";

import { db } from "@/db";
import { postTable, threadTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { content, threadId, userId } = await request.json();

    if (!content || !threadId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    let newPost;

    await db.transaction(async (tx) => {
      [newPost] = await db
        .insert(postTable)
        .values({
          content,
          threadId, // já é string (UUID)
          userId, // já é string
        })
        .returning();

      await tx
        .update(threadTable)
        .set({
          lastPostAt: new Date(),
          lastPostUserId: userId,
        })
        .where(eq(threadTable.id, threadId));
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
