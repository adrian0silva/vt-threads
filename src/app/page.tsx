import { Apple, Crown, Sparkles, Zap } from "lucide-react";

import { RightRail } from "@/components/right-rail";
import { SiteHeaderClient } from "@/components/site-header-client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { db } from "@/db";
import { forumTable } from "@/db/schema";

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

  // Agrupa fóruns por categoria
  const grouped = categories.map((cat) => ({
    ...cat,
    forums: forums.filter((f) => f.category === cat.value),
  }));

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
            🌈 Chaos Forums - Where Order Meets Its Demise
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
          <div className="flex-1 space-y-8">
            {grouped.map(
              (cat) =>
                cat.forums.length > 0 && (
                  <div key={cat.value} className="space-y-4">
                    {/* Category Header with Discordian Flair */}
                    <div
                      className={`${cat.color} rounded-lg p-4 text-white shadow-lg`}
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon}
                        <h3 className="text-xl font-bold">{cat.label}</h3>
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white"
                        >
                          {cat.forums.length} Forums
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm opacity-90">
                        {cat.description}
                      </p>
                    </div>

                    {/* Forums with Chaos Styling */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {cat.forums.map((forum) => (
                        <Card
                          key={forum.id}
                          className="group border-2 transition-all duration-300 hover:scale-105 hover:border-purple-300 hover:shadow-lg"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="text-lg font-bold transition-colors group-hover:text-purple-600">
                                {forum.title}
                              </h4>
                              <p className="line-clamp-2 text-sm text-gray-600">
                                {forum.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>🍎 Eris Approved</span>
                                <span>•</span>
                                <span>
                                  ⚡ Chaos Level:{" "}
                                  {Math.floor(Math.random() * 10) + 1}/10
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>

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
