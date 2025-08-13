// app/page.tsx ou app/home/page.tsx
import { eq } from "drizzle-orm";

import { EraSidebar } from "@/components/era-sidebar";
import { ForumCard } from "@/components/forum-card";
import { RightRail } from "@/components/right-rail";
import { SiteHeader } from "@/components/site-header";
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
  const forums = await db.select().from(forumTable);

  // Agrupa fóruns por categoria
  const grouped = categories.map((cat) => ({
    ...cat,
    forums: forums.filter((f) => f.category === cat.value),
  }));

  return (
    <>
      <EraSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="mx-auto mt-4 w-full max-w-7xl px-4">
          <Card className="border-primary/20">
            <CardContent className="flex items-center gap-3 p-3 text-sm">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                Go and vote for your favorite RPGs here!
              </span>
              <span className="hidden text-muted-foreground md:inline">
                You have until August 26 to make your voice heard!
              </span>
            </CardContent>
          </Card>
        </div>

        <main className="mx-auto w-full max-w-7xl px-4 py-6">
          <h2 className="mb-4 text-xl font-semibold">Forum list</h2>
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Conteúdo principal */}
            <div className="flex-1 space-y-6">
              {grouped.map(
                (cat) =>
                  cat.forums.length > 0 && (
                    <section key={cat.value}>
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                        {cat.label}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {cat.forums.map((forum) => (
                          <ForumCard
                            key={forum.id}
                            color={cat.value === "GAMING" ? "teal" : cat.value === "POLITICA" ? "purple" : "orange"}
                            title={forum.title}
                            description={forum.description}
                            stats={{
                              threads: "0", // TODO: puxar do banco
                              posts: "0", // TODO: puxar do banco
                            }}
                            last={{
                              user: "",
                              text: "",
                              ago: "",
                            }}
                          />
                        ))}
                      </div>
                    </section>
                  )
              )}
            </div>

            {/* Barra lateral */}
            <aside className="lg:w-80">
              <RightRail />
            </aside>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
