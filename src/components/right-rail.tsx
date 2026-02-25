import { Eye, MessageSquare, Users } from "lucide-react";

import { OnlineStats } from "@/components/online/OnlineStats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTotalForums, getTotalPosts, getTotalTopics, getTotalUsers } from "@/lib/stats";

export async function RightRail() {
  const totalUsers = await getTotalUsers();
  const totalForums = await getTotalForums();
  const totalTopics = await getTotalTopics();
  const totalPosts = await getTotalPosts();
  return (
    <div className="flex w-full flex-col gap-4 lg:w-80">
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
