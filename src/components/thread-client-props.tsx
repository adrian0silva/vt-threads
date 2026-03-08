"use client";

import Link from "next/link";
import { useRef } from "react";

import { PostCard } from "@/components/post-card";
import { ReplyForm, ReplyFormHandle } from "@/components/reply-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Clock, User } from "lucide-react";
import type { ThreadClientProps as ThreadClientPropsType } from "@/types/thread";

function ThreadHeader({
  thread,
}: {
  thread: { title: string; userName: string | null; createdAt: Date };
}) {
  return (
    <div className="chaos-card bg-primary text-primary-foreground mb-6 p-4 md:p-6">
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
  threadSlug,
  forumSlug,
  forumTitle,
  userId,
  isAuthenticated,
  thread,
}: ThreadClientPropsType) {
  const replyFormRef = useRef<ReplyFormHandle | null>(null);

  return (
    <>
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="mb-8 text-center">
            <h1 className="text-foreground text-3xl font-bold">
              Tópico de Discussão
            </h1>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Início</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/forums">Fóruns</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/forums/${forumSlug}`}>{forumTitle}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[200px] truncate sm:max-w-md">
                  {thread.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ThreadHeader thread={thread} />
        </div>
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                author: post.author,
                title: post.title,
                joinDate: post.joinDate,
                posts: post.posts,
                likes: post.likes,
                content: post.content,
                timestamp: post.timestamp,
                userAvatar: post.userAvatar ?? null,
                isOriginalPoster: post.isOriginalPoster,
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
        forum={threadSlug}
      />
    </>
  );
}
