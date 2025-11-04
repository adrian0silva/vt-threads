import { ChevronRight, Dot, MessageSquare } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ForumCardProps = {
  title?: string;
  description?: string;
  color?: "teal" | "purple" | "orange" | "green";
  stats?: { threads: string; posts: string };
  last?: { user: string; text: string; ago: string; avatar?: string };
  className?: string;
};

const colorClasses: Record<NonNullable<ForumCardProps["color"]>, string> = {
  teal: "bg-gradient-to-r from-purple-600 to-pink-500",
  purple: "bg-gradient-to-r from-purple-700 to-fuchsia-600",
  orange: "bg-gradient-to-r from-orange-600 to-red-500",
  green: "bg-gradient-to-r from-emerald-600 to-green-500",
};

export function ForumCard({
  title = "Fórum de Gaming",
  description = "Discussões sobre jogos e entretenimento.",
  color = "teal",
  stats = { threads: "2.7K", posts: "6.2M" },
  last = {
    user: "Usuário Anônimo",
    text: "Novo tópico criado!",
    ago: "1 minuto atrás",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  className,
}: ForumCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:border-gray-300",
        className,
      )}
    >
      <div className={cn("px-4 pt-4 pb-14 text-white", colorClasses[color])}>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-white/20 p-1.5">
            <MessageSquare className="size-4" />
          </div>
          <h3 className="text-base leading-tight font-semibold">{title}</h3>
        </div>
        <p className="mt-2 line-clamp-3 text-xs/5 opacity-90">{description}</p>

        <div className="mt-3 flex items-center gap-4 text-xs opacity-90">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" /> {stats.threads} Tópicos
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" /> {stats.posts} Mensagens
          </span>
        </div>
      </div>

      <CardContent className="relative -mt-10 rounded-t-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <Image
            src={
              last.avatar ??
              "/placeholder.svg?height=32&width=32&query=user-avatar"
            }
            alt=""
            width={32}
            height={32}
            className="rounded border border-gray-300"
          />
          <div className="min-w-0 text-sm">
            <p className="truncate">
              <span className="font-medium text-gray-700">{last.user}</span>
              <Dot className="mx-1 inline size-4 text-gray-500" />
              <span className="text-gray-600">{last.text}</span>
            </p>
            <p className="text-xs text-gray-500">{last.ago}</p>
          </div>
          <a
            href="#"
            className="ml-auto inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            Mais <ChevronRight className="ml-0.5 size-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
