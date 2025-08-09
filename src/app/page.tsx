import { EraSidebar } from "@/components/era-sidebar";
import { ForumCard } from "@/components/forum-card";
import { RightRail } from "@/components/right-rail";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar"

const Home = () => {
  return (
    <>
    <EraSidebar />

    <SidebarInset>
    <SiteHeader />
      <div className="mx-auto mt-4 w-full max-w-7xl px-4">
          <Card className="border-primary/20">
            <CardContent className="flex items-center gap-3 p-3 text-sm">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">Go and vote for your favorite RPGs here!</span>
              <span className="hidden text-muted-foreground md:inline">You have until August 26 to make your voice heard!</span>
            </CardContent>
          </Card>
        </div>
        <main className="mx-auto w-full max-w-7xl px-4 py-6">
          <h2 className="mb-4 text-xl font-semibold">Forum list</h2>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Center content */}
            <div className="flex-1 space-y-6">
              {/* Section: Discussion */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Discussion</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <ForumCard
                    color="teal"
                    title="Gaming Forum"
                    description="The latest video game news, discussions, announcements, industry gossip, sales figures, and reviews."
                    stats={{ threads: "210.3K", posts: "31.3M" }}
                    last={{
                      user: "deux",
                      text: "Gacha Games |OT| Gacha Wallet",
                      ago: "1 minute ago",
                    }}
                  />
                  <ForumCard
                    color="teal"
                    title="Gaming Hangouts"
                    description="If it’s a community related to gaming, it has a home here! Official threads, matchmaking, guilds and clans."
                    stats={{ threads: "2.7K", posts: "6.2M" }}
                    last={{
                      user: "deux",
                      text: "Weekly Co-op Squad Finder",
                      ago: "2 minutes ago",
                    }}
                  />
                </div>
              </section>

              {/* Section: EtcEra */}
              <section>
                <div className="grid gap-4 md:grid-cols-2">
                  <ForumCard
                    color="purple"
                    title="EtcEra Forum"
                    description="Everything else. Current events, entertainment, technology, food, pets, fandoms and everything in between."
                    stats={{ threads: "212.2K", posts: "24.8M" }}
                    last={{
                      user: "Modest_ModSoul",
                      text: "What are your thoughts on Pirates of the Caribbean…",
                      ago: "1 minute ago",
                    }}
                  />
                  <ForumCard
                    color="purple"
                    title="EtcEra Hangouts"
                    description="Hobbyist enclaves. Local, international and non‑English language threads."
                    stats={{ threads: "942", posts: "6.5M" }}
                    last={{
                      user: "Frezesaurus",
                      text: "OT | Forums are Temporary, Plastic and Common…",
                      ago: "2 minutes ago",
                    }}
                  />
                </div>
              </section>

              {/* Section: Official */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Official</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <ForumCard
                    color="orange"
                    title="Announcements"
                    description="Resources and staff communication."
                    stats={{ threads: "24", posts: "15.6K" }}
                    last={{
                      user: "Patlipoco",
                      text: "ResetEra Tech Thread (Report Bugs Here)",
                      ago: "Today at 8:36 AM",
                    }}
                  />
                  <ForumCard
                    color="green"
                    title="The Vault"
                    description="Treasured memories of threads past."
                    stats={{ threads: "152", posts: "298.1K" }}
                    last={{
                      user: "Richetto",
                      text: "Game Soundtracks of the Year 2024 - RESULTS",
                      ago: "Mar 21, 2025",
                    }}
                  />
                </div>
              </section>
            </div>

            {/* Right rail */}
            <aside className="lg:w-80">
              <RightRail />
            </aside>
          </div>
        </main>
      </SidebarInset>
    </>
  );
};

export default Home;