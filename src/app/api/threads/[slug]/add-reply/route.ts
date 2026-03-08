import { NextResponse } from "next/server";

import * as postService from "@/services/post.service";

export async function POST(request: Request) {
  try {
    const { content, threadId, userId } = await request.json();

    if (!content || !threadId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const result = await postService.addReply(threadId, userId, content);

    return NextResponse.json({ success: true, post: { id: result.id } });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
