import { eq, sql } from "drizzle-orm";
import {
  Apple,
  Clock,
  Crown,
  Eye,
  MessageSquare,
  PlusIcon,
  Sparkles,
  Zap,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { forumTable, postTable, threadTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

const ForumDetailsPage = async ({ params }: ForumPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { slug } = await params;

  const forumEncontrado = await db.query.forumTable.findFirst({
    where: eq(forumTable.slug, slug),
  });

  if (!forumEncontrado?.id) {
    return notFound();
  }

  const threads = await db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      createdAt: threadTable.createdAt,
      views: threadTable.views,
      postsCount: sql<number>`COUNT(${postTable.id})`.mapWith(Number),
      userName: userTable.name, // nome do usuário
      userAvatar: userTable.image, // avatar do usuário
    })
    .from(threadTable)
    .leftJoin(postTable, eq(postTable.threadId, threadTable.id))
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .where(eq(threadTable.forumId, forumEncontrado.id))
    .groupBy(
      threadTable.id,
      threadTable.title,
      threadTable.slug,
      threadTable.description,
      threadTable.views,
      userTable.name,
      userTable.image, // precisa entrar no groupBy também
    );

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
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4">
            <Sparkles className="h-5 w-5 animate-pulse text-yellow-500 sm:h-6 sm:w-6" />
            <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              🌪️ VT Forums 🌪️
            </h1>
            <Sparkles className="h-5 w-5 animate-pulse text-yellow-500 sm:h-6 sm:w-6" />
          </div>
          <p className="text-xs text-gray-600 italic sm:text-sm">
            &quot;{randomQuote}&quot; - Principia Discordia
          </p>
        </div>

        {/* Forum Header with Discordian Flair */}
        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
                {forumEncontrado.title}
              </h1>
              <p className="text-sm text-purple-100 sm:text-base">
                {forumEncontrado.description}
              </p>
              <div className="mt-3 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{threads.length} Chaos Threads</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>
                    {threads.reduce((sum, t) => sum + t.postsCount, 0)} Erisian
                    Messages
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span>
                    Chaos Level: {Math.floor(Math.random() * 10) + 1}/10
                  </span>
                </div>
              </div>
            </div>
            {session?.user && (
              <Link href={`/forums/${slug}/post-thread`}>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 font-medium text-white shadow-lg hover:from-orange-600 hover:to-red-600 sm:px-6 sm:py-3"
                  size="lg"
                >
                  <PlusIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">🌪️ Create Chaos</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Threads List with Discordian Styling */}
        {threads.length === 0 ? (
          <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 py-12 text-center">
            <div className="mb-4">
              <Apple className="mx-auto h-16 w-16 text-purple-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-purple-600">
              🌪️ No Chaos Yet! 🌪️
            </h3>
            <p className="mb-4 text-purple-500">
              This Discordian forum awaits its first thread of chaos!
            </p>
            <p className="text-sm text-purple-400 italic">
              &quot;Be the first to spread Erisian wisdom!&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {threads.map((thread) => (
              <Card
                key={thread.id}
                className="border-2 bg-gradient-to-r from-white to-purple-50 transition-all duration-300 hover:scale-[1.02] hover:border-purple-300 hover:shadow-lg"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Avatar do autor com estilo Discordiano */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                      <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-purple-300 sm:h-12 sm:w-12">
                        <AvatarImage
                          src={thread.userAvatar || "/placeholder.svg"}
                          alt={thread.userName || "Erisian User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {thread.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="sm:hidden">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Crown className="h-3 w-3" />
                          <span className="font-medium text-purple-600">
                            {thread.userName || "Anonymous Erisian"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo principal */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2">
                        <Link href={`/threads/${thread.slug}`}>
                          <h3 className="mb-1 line-clamp-2 text-base font-bold text-purple-800 transition-colors hover:text-purple-600 hover:underline sm:text-lg">
                            {thread.title}
                          </h3>
                        </Link>
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                          {thread.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-3">
                        <div className="hidden items-center gap-1 sm:flex">
                          <Crown className="h-3 w-3" />
                          <span className="font-medium text-purple-600">
                            {thread.userName || "Anonymous Erisian"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(thread.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-orange-300 text-xs text-orange-600"
                        >
                          ⚡ Chaos Level: {Math.floor(Math.random() * 10) + 1}
                          /10
                        </Badge>
                      </div>
                    </div>

                    {/* Estatísticas Discordianas */}
                    <div className="flex items-center justify-between gap-4 text-sm sm:flex-col sm:gap-6">
                      <div className="text-center">
                        <div className="mb-1 flex items-center gap-1 text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            Erisian Replies:
                          </span>
                          <span className="sm:hidden">Replies:</span>
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                          {thread.postsCount}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="mb-1 flex items-center gap-1 text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">
                            Chaos Observers:
                          </span>
                          <span className="sm:hidden">Views:</span>
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                          {thread.views}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

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
            <div className="mt-3 flex justify-center gap-4 text-xs text-purple-500">
              <span>🍎 Golden Apple</span>
              <span>⚡ Sacred Chao</span>
              <span>🌪️ Erisian Chaos</span>
              <span>🌈 Discordian Rainbow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetailsPage;
