import {
  ChevronRight,
  Dot,
  MessageSquare,
  Users,
  Apple,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react";
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
  title = "🌪️ Chaos Gaming Forum",
  description = "The latest Erisian gaming chaos, discussions, and Discordian reviews.",
  color = "teal",
  stats = { threads: "2.7K", posts: "6.2M" },
  last = {
    user: "Anonymous Erisian",
    text: "🍎 Golden Apple Found in Gaming Section!",
    ago: "1 minute ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  className,
}: ForumCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-2 border-purple-200 shadow-sm transition-all duration-300 hover:border-purple-300",
        className,
      )}
    >
      <div className={cn("px-4 pt-4 pb-14 text-white", colorClasses[color])}>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-white/20 p-1.5">
            <Apple className="size-4" />
          </div>
          <h3 className="text-base leading-tight font-semibold">{title}</h3>
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">
            🍎 Eris Approved
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-xs/5 opacity-90">{description}</p>

        <div className="mt-3 flex items-center gap-4 text-xs opacity-90">
          <span className="inline-flex items-center gap-1">
            <Zap className="size-3" /> {stats.threads} Chaos Threads
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" /> {stats.posts} Erisian Messages
          </span>
        </div>
      </div>

      <CardContent className="relative -mt-10 rounded-t-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="flex items-center gap-3">
          <Image
            src={
              last.avatar ??
              "/placeholder.svg?height=32&width=32&query=user-avatar"
            }
            alt=""
            width={32}
            height={32}
            className="rounded border-2 border-purple-300"
          />
          <div className="min-w-0 text-sm">
            <p className="truncate">
              <span className="font-medium text-purple-700">{last.user}</span>
              <Dot className="mx-1 inline size-4 text-purple-500" />
              <span className="text-purple-600">{last.text}</span>
            </p>
            <p className="text-xs text-purple-500">{last.ago}</p>
          </div>
          <a
            href="#"
            className="ml-auto inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
          >
            More <ChevronRight className="ml-0.5 size-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
