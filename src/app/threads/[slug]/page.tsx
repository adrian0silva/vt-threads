import { eq } from "drizzle-orm";
import {
  Apple,
  ChevronRight,
  Clock,
  Crown,
  Eye,
  MessageSquare,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";

import { ReplyForm } from "@/components/reply-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { postTable, threadTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { parseBBCode } from "@/utils/bbcode-parser";

interface ThreadPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

  const threadQuery = db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      views: threadTable.views,
      userId: threadTable.userId,
      userName: userTable.name,
      userAvatar: userTable.image,
      createdAt: threadTable.createdAt,
    })
    .from(threadTable)
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .where(eq(threadTable.slug, slug))
    .limit(1);

  const [thread] = await threadQuery.execute();

  if (!thread) throw new Error("Thread não encontrada");

  const postsQuery = db
    .select({
      id: postTable.id,
      content: postTable.content,
      createdAt: postTable.createdAt,
      userName: userTable.name,
      userAvatar: userTable.image,
      userId: postTable.userId,
    })
    .from(postTable)
    .leftJoin(userTable, eq(postTable.userId, userTable.id))
    .where(eq(postTable.threadId, thread.id))
    .orderBy(postTable.createdAt);

  const posts = await postsQuery.execute();

  const initialPost = {
    id: `thread-${thread.id}`,
    author: thread.userName || "Anonymous Erisian",
    title: "Discordian",
    joinDate: "Unknown",
    posts: "0",
    likes: "0",
    content: thread.description || "",
    timestamp: new Date(thread.createdAt).toLocaleString(),
    isOriginalPoster: true,
    userAvatar: thread.userAvatar,
  };

  const displayPosts = [
    initialPost,
    ...posts.map((post) => ({
      id: post.id,
      author: post.userName || "Anonymous Erisian",
      title: "Discordian",
      joinDate: "Unknown",
      posts: "0",
      likes: "0",
      content: post.content,
      timestamp: new Date(post.createdAt).toLocaleString(),
      isOriginalPoster: post.userId === thread.userId,
      userAvatar: post.userAvatar,
    })),
  ];

  const renderBBCodeContent = (content: string) => {
    const elements = parseBBCode(content);

    return (
      <div className="space-y-4">
        {elements.map((element, index) => {
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
                  className="overflow-hidden rounded-lg border-2 border-purple-300 shadow-lg"
                >
                  <Image
                    src={element.data?.url || "/placeholder.svg"}
                    alt={`Imagem ${index + 1}`}
                    className="h-auto max-h-96 w-full object-cover"
                  />
                </div>
              );

            case "youtube":
              return (
                <div
                  key={index}
                  className="aspect-video overflow-hidden rounded-lg border-2 border-orange-300 shadow-lg"
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
                  className="rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 p-4 shadow-lg"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-blue-500">
                      <span className="text-xs font-bold text-white">𝕏</span>
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
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver tweet original →
                  </a>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Discordian quotes for random display
  const erisianQuotes = [
    "We Discordians must stick apart!",
    "Nothing is true, everything is permitted",
    "All Hail Eris! All Hail Discordia!",
    "Chaos is the natural order of things",
    "Confusion is the beginning of wisdom",
  ];

  const randomQuote =
    erisianQuotes[Math.floor(Math.random() * erisianQuotes.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Discordian Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 animate-pulse text-yellow-500" />
            <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
              🌪️ Chaos Thread 🌪️
            </h1>
            <Sparkles className="h-6 w-6 animate-pulse text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600 italic">
            &quot;{randomQuote}&quot; - Principia Discordia
          </p>
        </div>

        {/* Discordian Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 rounded-lg bg-white/50 p-3 text-sm text-gray-600 shadow-sm">
          <a href="#" className="flex items-center gap-1 hover:text-purple-600">
            <Apple className="h-4 w-4" />
            Forums
          </a>
          <ChevronRight className="h-4 w-4" />
          <a href="#" className="flex items-center gap-1 hover:text-purple-600">
            <Crown className="h-4 w-4" />
            Discordian Society
          </a>
          <ChevronRight className="h-4 w-4" />
          <a href="#" className="flex items-center gap-1 hover:text-purple-600">
            <Zap className="h-4 w-4" />
            Vale Tudo Chaos
          </a>
        </nav>

        {/* Thread Header with Responsive Discordian Flair */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-lg md:p-6">
          <h1 className="mb-4 text-xl font-bold break-words md:text-3xl">
            {thread.title}
          </h1>

          <div className="flex flex-col space-y-3 text-sm md:flex-row md:items-center md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Erisian Creator</span>
                <a href="#" className="truncate font-medium hover:underline">
                  {thread.userName || "Anonymous Erisian"}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Chaos Began</span>
              <span>38 minutes ago</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>Chaos Level: {Math.floor(Math.random() * 10) + 1}/10</span>
            </div>
          </div>
        </div>

        {/* Posts with Discordian Styling */}
        {displayPosts.length > 0 ? (
          <div className="space-y-6">
            {displayPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden border-2 p-0 transition-all duration-300 hover:border-purple-300 hover:shadow-lg"
              >
                {/* Layout Mobile: Avatar em cima */}
                <div className="block md:hidden">
                  {/* Header Mobile com Avatar */}
                  <div className="border-b bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 border-2 border-purple-300">
                        <AvatarImage
                          src={
                            post.userAvatar ||
                            `/placeholder.svg?height=48&width=48&query=${post.author || "/placeholder.svg"}`
                          }
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {post.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="cursor-pointer font-semibold text-purple-600 hover:text-purple-800 hover:underline">
                            {post.author}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-xs text-purple-700"
                          >
                            {post.title}
                          </Badge>
                          {post.isOriginalPoster && (
                            <Badge
                              variant="default"
                              className="bg-gradient-to-r from-green-500 to-blue-500 text-xs"
                            >
                              🍎 OP
                            </Badge>
                          )}
                        </div>

                        <div className="mt-1 flex items-center space-x-3 text-xs text-purple-600">
                          <span>Posts: {post.posts}</span>
                          <span>Likes: {post.likes}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {post.timestamp}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-orange-300 text-xs text-orange-600"
                      >
                        ⚡ Erisian Message
                      </Badge>
                    </div>
                  </div>

                  {/* Content Mobile */}
                  <div className="bg-white p-4">
                    {renderBBCodeContent(post.content)}
                  </div>
                </div>

                {/* Layout Desktop: Avatar do lado */}
                <div className="hidden md:flex">
                  {/* User Info Sidebar - Desktop */}
                  <div className="w-48 border-r bg-gradient-to-b from-purple-50 to-pink-50 p-4">
                    <div className="text-center">
                      <Avatar className="mx-auto mb-2 h-16 w-16 border-2 border-purple-300">
                        <AvatarImage
                          src={
                            post.userAvatar ||
                            `/placeholder.svg?height=64&width=64&query=${post.author || "/placeholder.svg"}`
                          }
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {post.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="cursor-pointer font-semibold text-purple-600 hover:text-purple-800 hover:underline">
                        {post.author}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-purple-100 text-xs text-purple-700"
                      >
                        {post.title}
                      </Badge>
                      {post.isOriginalPoster && (
                        <Badge
                          variant="default"
                          className="mb-2 bg-gradient-to-r from-green-500 to-blue-500 text-xs"
                        >
                          🍎 OP
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-purple-600">
                      <div>Joined: {post.joinDate}</div>
                      <div>Posts: {post.posts}</div>
                      <div>Likes: {post.likes}</div>
                    </div>
                  </div>

                  {/* Post Content Desktop */}
                  <div className="flex-1 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {post.timestamp}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-orange-300 text-xs text-orange-600"
                      >
                        ⚡ Erisian Message
                      </Badge>
                    </div>
                    {renderBBCodeContent(post.content)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-purple-400" />
            <h3 className="mb-2 text-lg font-semibold text-purple-600">
              No chaos yet
            </h3>
            <p className="text-purple-500">
              Be the first to spread Erisian wisdom!
            </p>
          </Card>
        )}

        <ReplyForm
          threadId={thread.id}
          userId={session?.user?.id}
          isAuthenticated={!!session?.user}
          forum={slug}
        />

        {/* Discordian Thread Stats */}
        <div className="mt-6 rounded-lg border-2 border-orange-200 bg-gradient-to-r from-orange-100 to-red-100 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-orange-700">
                <Eye className="h-4 w-4" />
                <span>{thread.views || 1247} chaos observers</span>
              </div>
              <div className="flex items-center space-x-1 text-orange-700">
                <MessageSquare className="h-4 w-4" />
                <span>{displayPosts.length} Erisian replies</span>
              </div>
              <div className="flex items-center space-x-1 text-orange-700">
                <Apple className="h-4 w-4" />
                <span>
                  Chaos Level: {Math.floor(Math.random() * 10) + 1}/10
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-700">Spread Chaos:</span>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-orange-200"
                >
                  🌪️ Discordian Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-orange-200"
                >
                  ⚡ Erisian Broadcast
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-orange-200"
                >
                  🍎 Golden Apple
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Discordian Footer */}
        <div className="mt-8 text-center">
          <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 p-4">
            <h3 className="mb-2 text-sm font-bold text-purple-800">
              🌟 All Hail Eris! All Hail Discordia! 🌟
            </h3>
            <p className="text-xs text-purple-600">
              &quot;We Discordians must stick apart!&quot; - Malaclypse the
              Younger
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
