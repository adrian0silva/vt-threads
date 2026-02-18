"use client";

import { useRef } from "react";

import { PostCard } from "@/components/post-card";
import { ReplyForm, ReplyFormHandle } from "@/components/reply-form";
import { Breadcrumb } from "./ui/breadcrumb";
import { Clock, User } from "lucide-react";
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
  thread: { title: string; userName: string | null; createdAt: Date };
}

function ThreadHeader({
  thread,
}: {
  thread: { title: string; userName: string | null; createdAt: Date };
}) {
  return (
    <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg md:p-6">
      <h1 className="mb-4 text-xl font-bold break-words md:text-3xl">
        {thread.title}
      </h1>
      <div className="flex flex-col space-y-3 text-sm md:flex-row md:items-center md:space-y-0 md:space-x-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Autor:</span>
            <a href="#" className="truncate font-medium hover:underline">
              {thread.userName || "Usuário Anônimo"}
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span className="hidden md:inline">Criado em:</span>
          <span>{new Date(thread.createdAt).toLocaleDateString("pt-BR")}</span>
        </div>
      </div>
    </div>
  );
}
export function ThreadClient({
  posts,
  threadId,
  forum,
  userId,
  isAuthenticated,
  thread,
}: ThreadClientProps) {
  const replyFormRef = useRef<ReplyFormHandle | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Tópico de Discussão
            </h1>
          </div>

          <Breadcrumb />
          <ThreadHeader thread={thread} />
        </div>
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