import { ChevronRight, Dot, MessageSquare, Users } from 'lucide-react'
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ForumCardProps = {
  title?: string
  description?: string
  color?: "teal" | "purple" | "orange" | "green"
  stats?: { threads: string; posts: string }
  last?: { user: string; text: string; ago: string; avatar?: string }
  className?: string
}

const colorClasses: Record<NonNullable<ForumCardProps["color"]>, string> = {
  teal: "bg-gradient-to-r from-teal-600 to-teal-500",
  purple: "bg-gradient-to-r from-purple-700 to-fuchsia-600",
  orange: "bg-gradient-to-r from-orange-600 to-amber-500",
  green: "bg-gradient-to-r from-emerald-600 to-green-500",
}

export function ForumCard({
  title = "Gaming Forum",
  description = "The latest video game news, discussions, announcements and reviews.",
  color = "teal",
  stats = { threads: "2.7K", posts: "6.2M" },
  last = {
    user: "deux",
    text: "Gacha Games |OT| Gacha Wallet",
    ago: "1 minute ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  className,
}: ForumCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-sm", className)}>
      <div className={cn("px-4 pb-14 pt-4 text-white", colorClasses[color])}>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-white/20 p-1.5">
            <MessageSquare className="size-4" />
          </div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">New</span>
        </div>
        <p className="mt-2 line-clamp-3 text-xs/5 opacity-90">{description}</p>

        <div className="mt-3 flex items-center gap-4 text-xs opacity-90">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" /> {stats.threads}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" /> {stats.posts}
          </span>
        </div>
      </div>

      <CardContent className="relative -mt-10 rounded-t-xl bg-background p-4">
        <div className="flex items-center gap-3">
          <Image
            src={last.avatar ?? "/placeholder.svg?height=32&width=32&query=user-avatar"}
            alt=""
            width={32}
            height={32}
            className="rounded"
          />
          <div className="min-w-0 text-sm">
            <p className="truncate">
              <span className="font-medium">{last.user}</span>
              <Dot className="mx-1 inline size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{last.text}</span>
            </p>
            <p className="text-xs text-muted-foreground">{last.ago}</p>
          </div>
          <a href="#" className="ml-auto inline-flex items-center text-sm text-primary">
            More <ChevronRight className="ml-0.5 size-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
