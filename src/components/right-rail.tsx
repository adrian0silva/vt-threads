import {
  Apple,
  Crown,
  Eye,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function RightRail() {
  const chaosThreads = [
    {
      title: "�� Golden Apple Found in Gaming Section!",
      forum: "Chaos Gaming",
      minutes: 5,
      chaosLevel: 9,
    },
    {
      title: "⚡ Erisian Politics: Why Anarchy is the Best Democracy",
      forum: "Discordian Politics",
      minutes: 34,
      chaosLevel: 10,
    },
    {
      title: "🌪️ Sacred Chao Spotted in Vale Tudo!",
      forum: "Vale Tudo Chaos",
      minutes: 79,
      chaosLevel: 8,
    },
    {
      title: "🌈 Discordian Rainbow Theory Explained",
      forum: "Chaos Gaming",
      minutes: 95,
      chaosLevel: 7,
    },
  ];

  const erisianQuotes = [
    "We Discordians must stick apart!",
    "Nothing is true, everything is permitted",
    "All Hail Eris! All Hail Discordia!",
    "Chaos is the natural order of things",
    "Confusion is the beginning of wisdom",
  ];

  const randomQuote =
    erisianQuotes[Math.floor(Math.random() * erisianQuotes.length)];

  return (
    <div className="flex w-full flex-col gap-4 lg:w-80">
      {/* Discordian Statistics */}
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-purple-800">
              ⚡ Chaos Statistics
            </h4>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-purple-600">
                <Users className="h-4 w-4" />
                Erisians Online:
              </dt>
              <dd className="font-bold text-purple-800">1,780</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-purple-600">
                <Eye className="h-4 w-4" />
                Chaos Observers:
              </dt>
              <dd className="font-bold text-purple-800">10,711</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-purple-600">
                <Apple className="h-4 w-4" />
                Total Discordians:
              </dt>
              <dd className="font-bold text-purple-800">12,491</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-purple-600 italic">
            &quot;Numbers are illusions, but chaos is eternal.&quot; - Eris
          </p>
        </CardContent>
      </Card>

      {/* Latest Chaos Threads */}
      <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold text-orange-800">🌪️ Latest Chaos</h4>
          </div>
          <ul className="space-y-3 text-sm">
            {chaosThreads.map((t, i) => (
              <li key={i} className="space-y-1">
                <Link
                  href="#"
                  className="line-clamp-2 text-orange-700 hover:text-orange-900 hover:underline"
                >
                  {t.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <span>{t.forum}</span>
                  <span>•</span>
                  <span>{t.minutes} minutes ago</span>
                  <Badge
                    variant="outline"
                    className="border-orange-400 text-xs text-orange-700"
                  >
                    Chaos {t.chaosLevel}/10
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Discordian Forum Statistics */}
      <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-800">
              🍎 Sacred Statistics
            </h4>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-green-600">
                <MessageSquare className="h-4 w-4" />
                Chaos Threads:
              </dt>
              <dd className="font-bold text-green-800">533,625</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-green-600">
                <Zap className="h-4 w-4" />
                Erisian Messages:
              </dt>
              <dd className="font-bold text-green-800">68,203,114</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1 text-green-600">
                <Users className="h-4 w-4" />
                Discordian Members:
              </dt>
              <dd className="font-bold text-green-800">62,471</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Erisian Quote of the Moment */}
      <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Apple className="h-5 w-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-800">🌈 Erisian Wisdom</h4>
          </div>
          <blockquote className="text-sm text-yellow-700 italic">
            &quot;{randomQuote}&quot;
          </blockquote>
          <p className="mt-2 text-xs text-yellow-600">- Principia Discordia</p>
        </CardContent>
      </Card>

      {/* Discordian Calendar */}
      <Card className="border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Apple className="h-5 w-5 text-pink-600" />
            <h4 className="font-semibold text-pink-800">
              📅 Discordian Calendar
            </h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-pink-600">Current Season:</span>
              <span className="font-bold text-pink-800">Chaos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pink-600">Day of Week:</span>
              <span className="font-bold text-pink-800">Sweetmorn</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pink-600">Holy Day:</span>
              <span className="font-bold text-pink-800">Eris Day</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-pink-600 italic">
            &quot;Time is an illusion. Lunchtime doubly so.&quot; - Eris
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
