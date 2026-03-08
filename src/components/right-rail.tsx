import { Eye, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

import { OnlineStats } from "@/components/online/OnlineStats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTotalForums, getTotalPosts, getTotalTopics, getTotalUsers } from "@/lib/stats";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function RightRail() {
  const totalUsers = await getTotalUsers();
  const totalForums = await getTotalForums();
  const totalTopics = await getTotalTopics();
  const totalPosts = await getTotalPosts();
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex w-full flex-col gap-4 lg:w-80">
      {/* Filtros rápidos — Principia */}
      <Card className="chaos-card border-border bg-card border">
        <CardContent className="p-4">
          <h4 className="chaos-heading mb-3 font-semibold">Filtros</h4>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              Todos os tópicos
            </Link>
            {session?.user && (
              <>
                <Link
                  href="/?filter=answered-by-me"
                  className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Respondidos por mim
                </Link>
                <Link
                  href="/?filter=viewed-by-me"
                  className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Visualizadas por mim
                </Link>
              </>
            )}
            <Link
              href="/?filter=unanswered"
              className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              Sem respostas
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas — Principia */}
      <Card className="chaos-card border-border bg-card border">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h4 className="chaos-heading font-semibold">Estatísticas</h4>
          </div>
          <dl className="space-y-2 text-sm">
            <OnlineStats />
            <div className="flex justify-between">
              <dt className="text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Total de Membros:
              </dt>
              <dd className="font-bold text-foreground">
                {totalUsers.toLocaleString("pt-BR")}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Estatísticas Gerais — Principia */}
      <Card className="chaos-card border-border bg-card border">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h4 className="chaos-heading font-semibold">Estatísticas Gerais</h4>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Foruns:
              </dt>
              <dd className="font-bold text-foreground">{totalForums.toLocaleString("pt-BR")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Topicos:
              </dt>
              <dd className="font-bold text-foreground">{totalTopics.toLocaleString("pt-BR")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Posts:
              </dt>
              <dd className="font-bold text-foreground">{totalPosts.toLocaleString("pt-BR")}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
