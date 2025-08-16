import { NextResponse } from "next/server";

import { db } from "@/db";
import { postTable } from "@/db/schema";

export async function POST(request: Request) {
    try {
      const { content, threadId, userId } = await request.json();
  
      if (!content || !threadId || !userId) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400 }
        );
      }
  
      const [newPost] = await db
        .insert(postTable)
        .values({
          content,
          threadId, // já é string (UUID)
          userId,   // já é string
        })
        .returning();
  
      return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }
  }
  