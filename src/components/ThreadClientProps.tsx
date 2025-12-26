"use client";

import { useRef } from "react";

import { PostCard } from "@/components/post-card";
import { ReplyForm, ReplyFormHandle } from "@/components/reply-form";
interface Post {
  id: string;
  author: string;
  title: string;
  joinDate: string;
  posts: string;
  likes: string;
  content: string;
  timestamp: string;
  isOriginalPoster: boolean;
  userAvatar: string | null;
  signature?: string | null;
}
interface ThreadClientProps {
  posts: Post[];
  threadId: string;
  forum: string;
  userId: string;
  isAuthenticated: boolean;
}

export function ThreadClient({
  posts,
  threadId,
  forum,
  userId,
  isAuthenticated,
}: ThreadClientProps) {
  const replyFormRef = useRef<ReplyFormHandle | null>(null);

  return (
    <>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              author: post.author as string,
              title: post.title,
              joinDate: post.joinDate,
              posts: post.posts,
              likes: post.likes,
              content: post.content as string,
              timestamp: post.timestamp as string,
              userAvatar: post.userAvatar ?? null,
              isOriginalPoster: post.isOriginalPoster as boolean,
            }}
            onReply={(user, content) =>
              replyFormRef.current?.replyTo(user, content)
            }
          />
        ))}
      </div>

      <ReplyForm
        ref={replyFormRef}
        threadId={threadId}
        userId={userId}
        isAuthenticated={isAuthenticated}
        forum={forum}
      />
    </>
  );
}
