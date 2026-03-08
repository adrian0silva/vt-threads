"use client";

import { ChevronRight, Clock, Eye, MessageSquare, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Post } from "@/types/post";
import { parseBBCode } from "@/utils/bbcode-parser";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface BBCodeElement {
  type: string;
  content: string;
  data?: {
    url?: string;
    id?: string;
    username?: string;
  };
}

// Componente para renderizar conteúdo BBCode
function BBCodeContent({ content }: { content: string }) {
  const elements = parseBBCode(content) as BBCodeElement[];

  const renderElement = (element: BBCodeElement, index: number) => {
    switch (element.type) {
      case "text":
        return (
          <div
            key={index}
            className="prose prose-sm dark:prose-invert max-w-none"
          >
            <p className="text-foreground whitespace-pre-wrap">
              {element.content}
            </p>
          </div>
        );

      case "image":
        return (
          <div
            key={index}
            className="border-border overflow-hidden rounded-lg border shadow-md"
          >
            <img
              src={element.data?.url || "/placeholder.svg"}
              alt={`Imagem ${index + 1}`}
              className="h-auto w-full object-contain"
            />
          </div>
        );

      case "youtube":
        return (
          <div
            key={index}
            className="border-border aspect-video overflow-hidden rounded-lg border shadow-md"
          >
            <iframe
              src={`https://www.youtube.com/embed/${element.data?.id}`}
              title={`Vídeo ${index + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        );

      case "twitter":
        return (
          <div
            key={index}
            className="border-border bg-muted rounded-lg border p-4 shadow-md"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="bg-foreground flex h-4 w-4 items-center justify-center rounded-sm">
                <span className="text-background text-xs font-bold">𝕏</span>
              </div>
              <span className="text-muted-foreground text-sm">
                Tweet incorporado
              </span>
            </div>
            <a
              href={
                element.content.startsWith("http")
                  ? element.content
                  : `https://twitter.com/i/status/${element.data?.id}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              Ver tweet original →
            </a>
          </div>
        );

      case "quote":
        return (
          <div
            key={index}
            className="border-border my-4 overflow-hidden rounded-md border bg-muted/50"
          >
            <div className="bg-accent text-accent-foreground px-4 py-1.5 font-bold">
              {element.data?.username ? `${element.data.username}:` : "Quote:"}
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 pt-2 text-muted-foreground">
              {element.content}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="space-y-4">{elements.map(renderElement)}</div>;
}

// Componente para User Info Sidebar (Desktop)
function UserSidebar({ post }: { post: Post }) {
  return (
    <div className="border-border w-48 border-r bg-muted p-4">
      <div className="text-center">
        <Avatar className="border-border mx-auto mb-2 h-36 w-36 rounded-none border">
          <AvatarImage
            src={
              post.userAvatar ||
              `/placeholder.svg?height=64&width=64&query=${post.author}`
            }
          />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {post.author.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-foreground hover:text-primary cursor-pointer font-semibold hover:underline">
          {post.author}
        </h3>
        <Badge
          variant="secondary"
          className="mb-2 text-xs"
        >
          {post.title}
        </Badge>
        {post.isOriginalPoster && (
          <Badge variant="default" className="mb-2 text-xs">
            OP
          </Badge>
        )}
      </div>
      <div className="text-muted-foreground mt-3 space-y-1 text-xs">
        <div>Membro desde: {post.joinDate}</div>
        <div>Posts: {post.posts}</div>
        <div>Likes: {post.likes}</div>
      </div>
    </div>
  );
}

// Componente para Header Mobile
function MobilePostHeader({ post }: { post: Post }) {
  return (
    <div className="border-border border-b bg-muted p-4">
      <div className="flex items-center space-x-3">
        <Avatar className="border-border h-12 w-12 rounded-none border">
          <AvatarImage
            src={
              post.userAvatar ||
              `/placeholder.svg?height=48&width=48&query=${post.author}`
            }
          />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {post.author.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-foreground hover:text-primary cursor-pointer font-semibold hover:underline">
              {post.author}
            </h3>
            <Badge
              variant="secondary"
              className="text-xs"
            >
              {post.title}
            </Badge>
            {post.isOriginalPoster && (
              <Badge variant="default" className="text-xs">
                OP
              </Badge>
            )}
          </div>

          <div className="text-muted-foreground mt-1 flex items-center space-x-3 text-xs">
            <span>Posts: {post.posts}</span>
            <span>Likes: {post.likes}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{post.timestamp}</span>
        <Badge
          variant="outline"
          className="text-muted-foreground text-xs"
        >
          Mensagem
        </Badge>
      </div>
    </div>
  );
}

// Componente para ações do post
function PostActions({ onReply }: { onReply: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground flex items-center gap-1"
      >
        👍 Like
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground flex items-center gap-1"
        onClick={onReply}
      >
        💬 Reply
      </Button>
    </div>
  );
}

// Componente para Post Card

// Componente para Breadcrumb
function Breadcrumb() {
  return (
    <nav className="text-muted-foreground mb-6 flex items-center space-x-2 rounded-lg bg-card p-3 text-sm shadow-sm">
      <a href="#" className="text-primary flex items-center gap-1 hover:underline">
        <MessageSquare className="h-4 w-4" />
        Fóruns
      </a>
      <ChevronRight className="h-4 w-4" />
      <a href="#" className="text-primary flex items-center gap-1 hover:underline">
        <MessageSquare className="h-4 w-4" />
        Categoria
      </a>
      <ChevronRight className="h-4 w-4" />
      <a href="#" className="text-primary flex items-center gap-1 hover:underline">
        <MessageSquare className="h-4 w-4" />
        Fórum
      </a>
    </nav>
  );
}

// Componente para Thread Header
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

// Componente para Thread Stats
function ThreadStats({
  views,
  repliesCount,
}: {
  views: number;
  repliesCount: number;
}) {
  return (
    <div className="border-border bg-muted mt-6 rounded-lg border p-4">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="text-foreground flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{views} visualizações</span>
          </div>
          <div className="text-foreground flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{repliesCount} respostas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para Empty State
function EmptyState() {
  return (
    <Card className="border-border bg-muted p-8 text-center">
      <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
      <h3 className="text-foreground mb-2 text-lg font-semibold">
        Ainda não há mensagens
      </h3>
      <p className="text-muted-foreground">
        Seja o primeiro a responder a este tópico!
      </p>
    </Card>
  );
}

export function PostCard({
  post,
  onReply,
}: {
  post: Post;
  onReply: (user: string, content: string) => void;
}) {
  return (
    <Card className="border-border overflow-hidden border bg-card">
      {/* MOBILE */}
      <div className="block md:hidden">
        <MobilePostHeader post={post} />
        <div className="p-4">
          <BBCodeContent content={post.content} />
        </div>
        <div className="px-4 pb-4">
          <PostActions onReply={() => onReply(post.author, post.content)} />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex">
        <UserSidebar post={post} />
        <div className="flex flex-1 flex-col">
          <div className="p-4">
            <BBCodeContent content={post.content} />
          </div>
          <div className="bg-muted mt-auto px-4 py-3">
            <PostActions onReply={() => onReply(post.author, post.content)} />
          </div>
        </div>
      </div>
    </Card>
  );
}