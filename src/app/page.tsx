// app/page.tsx ou app/home/page.tsx
import { eq } from "drizzle-orm";

import ForumList from "@/components/common/forum-list";
import { ForumCard } from "@/components/forum-card";
import { RightRail } from "@/components/right-rail";
import { SiteHeaderClient } from "@/components/site-header-client";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { db } from "@/db";
import { forumTable } from "@/db/schema";

const categories: { value: "GAMING" | "POLITICA" | "VALE_TUDO"; label: string }[] = [
  { value: "GAMING", label: "Gaming" },
  { value: "POLITICA", label: "Política" },
  { value: "VALE_TUDO", label: "Vale Tudo" },
];

export default async function Home() {
  // Busca todos os fóruns do banco
  const forums = await db.query.forumTable.findMany({})

  // Agrupa fóruns por categoria
  const grouped = categories.map((cat) => ({
    ...cat,
    forums: forums.filter((f) => f.category === cat.value),
  }));

  return (
    <>
   

        <main className="mx-auto w-full max-w-7xl px-4 py-6">
          <h2 className="mb-4 text-xl font-semibold">Forum list</h2>
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Conteúdo principal */}
            <div className="flex-1 space-y-6">
              {grouped.map(
                (cat) =>
                  cat.forums.length > 0 && (
                    <ForumList category={cat.label} categoryValue={cat.value} forums={cat.forums} key={cat.value}/>
                  )
              )}
            </div>

            {/* Barra lateral */}
            <aside className="lg:w-80">
              <RightRail />
            </aside>
          </div>
        </main>

    </>
  );
}
