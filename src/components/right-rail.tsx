import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

export function RightRail() {
  const latest = [
    { title: "New official Dino Crisis merchandise revealed by Capcom Japan", forum: "Gaming Forum", minutes: 5 },
    { title: "LTTP: Xenogears (with QoL mods)", forum: "Gaming Forum", minutes: 34 },
    { title: "Jim Carrey was to star in a Lupin The 3rd live action...", forum: "EtcEra", minutes: 79 },
    { title: "Why so much hate for Mario Kart World's Open World mode?", forum: "Gaming Forum", minutes: 95 },
  ]
  return (
    <div className="flex w-full flex-col gap-4 lg:w-80">
      <Card>
        <CardContent className="p-4">
          <h4 className="mb-3 font-semibold">Online statistics</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Members online:</dt><dd>1,780</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Guests online:</dt><dd>10,711</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Total visitors:</dt><dd>12,491</dd></div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">Totals may include hidden visitors.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="mb-3 font-semibold">Latest threads</h4>
          <ul className="space-y-3 text-sm">
            {latest.map((t, i) => (
              <li key={i} className="space-y-0.5">
                <Link href="#" className="line-clamp-2 hover:underline">{t.title}</Link>
                <div className="text-xs text-muted-foreground">{t.forum} • {t.minutes} minutes ago</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="mb-3 font-semibold">Forum statistics</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Threads:</dt><dd>533,625</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Messages:</dt><dd>68,203,114</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Members:</dt><dd>62,471</dd></div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
