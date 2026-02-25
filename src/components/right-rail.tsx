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
      {/* Filtros rápidos */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-4">
          <h4 className="mb-3 font-semibold text-gray-800">Filtros</h4>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Todos os tópicos
            </Link>
            {session?.user && (
              <>
                <Link
                  href="/?filter=answered-by-me"
                  className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Respondidos por mim
                </Link>
                <Link
                  href="/?filter=viewed-by-me"
                  className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Visualizadas por mim
                </Link>
              </>
            )}
            <Link
              href="/?filter=unanswered"
              className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sem respostas
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas do Fórum */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold text-gray-800">Estatísticas</h4>
          </div>
          <dl className="space-y-2 text-sm">
            <OnlineStats />
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-gray-600">
                <Users className="h-4 w-4" />
                Total de Membros:
              </dt>
              <dd className="font-bold text-gray-800">
                {totalUsers.toLocaleString("pt-BR")}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Estatísticas do Fórum */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <h4 className="font-semibold text-gray-800">Estatísticas Gerais</h4>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-gray-600">
                <MessageSquare className="h-4 w-4" />
                Foruns:
              </dt>
              <dd className="font-bold text-gray-800">{totalForums.toLocaleString("pt-BR")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-gray-600">
                <MessageSquare className="h-4 w-4" />

                Topicos:
              </dt>
              <dd className="font-bold text-gray-800">{totalTopics.toLocaleString("pt-BR")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-gray-600">
                <Users className="h-4 w-4" />
                Posts:
              </dt>
              <dd className="font-bold text-gray-800">{totalPosts.toLocaleString("pt-BR")}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
