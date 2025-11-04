"use server"
import { eq, sql } from "drizzle-orm";
import { Apple, Clock, Crown, Eye, MessageSquare, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

import { RightRail } from "@/components/right-rail";
import { SiteHeaderClient } from "@/components/site-header-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { db } from "@/db";
import { forumTable, postTable, threadTable, userTable } from "@/db/schema";

const categories: {
  value: "GAMING" | "POLITICA" | "VALE_TUDO";
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}[] = [
  {
    value: "GAMING",
    label: "🎮 Chaos Gaming",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Where pixels meet pandemonium",
  },
  {
    value: "POLITICA",
    label: "⚡ Discordian Politics",
    icon: <Crown className="h-5 w-5" />,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    description: "Anarchy with a side of confusion",
  },
  {
    value: "VALE_TUDO",
    label: "🌪️ Vale Tudo Chaos",
    icon: <Apple className="h-5 w-5" />,
    color: "bg-gradient-to-r from-green-500 to-blue-500",
    description: "Everything goes, nothing matters",
  },
];

export default async function Home() {
  // Busca todos os fóruns do banco
  const forums = await db.query.forumTable.findMany({});
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
      .groupBy(
        threadTable.id,
        threadTable.title,
        threadTable.slug,
        threadTable.description,
        threadTable.views,
        userTable.name,
        userTable.image, // precisa entrar no groupBy também
      );
  // Agrupa fóruns por categoria
  // const grouped = categories.map((cat) => ({
  //   ...cat,
  //   forums: forums.filter((f) => f.category === cat.value),
  // }));

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Discordian Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 animate-pulse text-yellow-500" />
            <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-4xl font-bold text-transparent">
              Principia Discordia
            </h1>
            <Sparkles className="h-8 w-8 animate-pulse text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600 italic">
            &quot;All Hail Eris! All Hail Discordia!&quot;
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge
              variant="outline"
              className="border-purple-500 text-purple-700"
            >
              🍎 Golden Apple Approved
            </Badge>
            <Badge
              variant="outline"
              className="border-orange-500 text-orange-700"
            >
              ⚡ Chaos Certified
            </Badge>
            <Badge variant="outline" className="border-pink-500 text-pink-700">
              🌪️ Erisian Blessed
            </Badge>
          </div>
        </div>

        {/* Chaos Navigation */}
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            🌈 Fnord Forums - Where Order Meets Its Demise
          </h2>
          <p className="mb-6 text-gray-600">
            Welcome to the Discordian Society! Here, we embrace chaos, celebrate
            confusion, and worship the Goddess Eris. Remember: &quot;Nothing is
            true, everything is permitted&quot; (except taking things too
            seriously).
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Conteúdo principal */}
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
                      {/* <div className="text-center">
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
                      </div> */}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

          {/* Barra lateral com Discordian Content */}
          <aside className="lg:w-80">
            <RightRail />
          </aside>
        </div>

        {/* Discordian Footer */}
        <div className="mt-12 text-center">
          <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-6">
            <h3 className="mb-2 text-lg font-bold text-gray-800">
              🌟 The Discordian Society Welcomes You! 🌟
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              &quot;We Discordians must stick apart!&quot; - Malaclypse the
              Younger
            </p>
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>🍎 Golden Apple</span>
              <span>⚡ Sacred Chao</span>
              <span>🌪️ Erisian Chaos</span>
              <span>�� Discordian Rainbow</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
