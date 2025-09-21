"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Apple,
  Bold,
  ChevronRight,
  Code,
  Crown,
  Eye,
  ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Paperclip,
  Quote,
  Redo,
  Sparkles,
  Strikethrough,
  Table,
  Underline,
  Undo,
  Zap,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

interface Forum {
  id: string;
  title: string;
  slug: string;
  // outras propriedades...
}

const PostThread = () => {
  const router = useRouter();
  const params = useParams();
  const forumSlug = params.slug;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState("");
  const [watchThread, setWatchThread] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [forumEncontrado, setForumEncontrado] = useState<Forum | null>(null);
  const { data: session } = authClient.useSession();

  // Discordian quotes for random display
  const erisianQuotes = [
    "Nothing is true, everything is permitted",
    "We Discordians must stick apart!",
    "Chaos is the natural order of things",
    "All Hail Eris! All Hail Discordia!",
    "Confusion is the beginning of wisdom",
    "Sacred Chao brings balance to chaos",
  ];

  const [randomQuote] = useState(
    erisianQuotes[Math.floor(Math.random() * erisianQuotes.length)],
  );

  useEffect(() => {
    async function fetchForum() {
      const forum = await fetch(`/api/forums/${forumSlug}`).then((res) =>
        res.json(),
      );
      setForumEncontrado(forum);
    }
    fetchForum();
  }, [forumSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: message,
        forumId: forumEncontrado?.id,
        userId: session?.user.id,
      }),
    });

    if (res.ok) {
      router.push(`/forums/${forumSlug}`);
      setTitle("");
      setMessage("");
    } else {
      const data = await res.json();
      alert("Error: " + data.error);
    }
  };

  const handleWatchThreadChange = (checked: boolean | "indeterminate") => {
    setWatchThread(checked === true);
  };

  const handleEmailNotificationsChange = (
    checked: boolean | "indeterminate",
  ) => {
    setEmailNotifications(checked === true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="mx-auto max-w-6xl p-6">
        {/* Discordian Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 animate-pulse text-yellow-500" />
            <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-4xl font-bold text-transparent">
              🌪️ Spread Erisian Chaos 🌪️
            </h1>
            <Sparkles className="h-8 w-8 animate-pulse text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600 italic">
            &quot;{randomQuote}&quot; - Principia Discordia
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge
              variant="outline"
              className="animate-pulse border-purple-500 text-purple-700"
            >
              🍎 Golden Apple Approved
            </Badge>
            <Badge
              variant="outline"
              className="animate-pulse border-orange-500 text-orange-700"
            >
              ⚡ Chaos Level: {Math.floor(Math.random() * 10) + 1}/10
            </Badge>
            <Badge
              variant="outline"
              className="animate-pulse border-pink-500 text-pink-700"
            >
              🌪️ Erisian Blessed
            </Badge>
          </div>
        </div>

        {/* Chaos Navigation */}
        <nav className="mb-6 flex items-center space-x-2 rounded-lg border-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 p-4 text-sm text-purple-700 shadow-lg">
          <a
            href="#"
            className="flex items-center gap-1 transition-colors hover:text-purple-900"
          >
            <Apple className="h-4 w-4" />
            Discordian Forums
          </a>
          <ChevronRight className="h-4 w-4" />
          <a
            href="#"
            className="flex items-center gap-1 transition-colors hover:text-purple-900"
          >
            <Crown className="h-4 w-4" />
            Chaos Central
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="flex items-center gap-1 font-medium text-purple-900">
            <Zap className="h-4 w-4" />
            Create Chaos Thread
          </span>
        </nav>

        <div className="border-gradient-to-r overflow-hidden rounded-xl border-4 bg-white from-purple-300 to-pink-300 shadow-2xl">
          {/* Chaotic Header */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                🌟 Post New Chaos Thread 🌟
              </h1>
              <div className="flex items-center gap-2">
                <Badge className="animate-bounce bg-white/20 text-white">
                  ⚡ Erisian Energy Active
                </Badge>
                <Sparkles className="h-6 w-6 animate-spin" />
              </div>
            </div>
            <p className="mt-2 text-sm opacity-90">
              Spread confusion, embrace discord, celebrate chaos!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6">
            {/* Chaotic Title Section */}
            <div className="space-y-3 rounded-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
              <Label
                htmlFor="title"
                className="flex items-center gap-2 text-lg font-bold text-purple-800"
              >
                🎯 Thread Title of Chaos:
                <Badge
                  variant="outline"
                  className="border-orange-400 text-orange-600"
                >
                  Required by Eris
                </Badge>
              </Label>
              <div className="flex gap-3">
                <Select defaultValue="no-prefix">
                  <SelectTrigger className="w-40 border-2 border-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-prefix">🌪️ Pure Chaos</SelectItem>
                    <SelectItem value="question">
                      ❓ Confused Question
                    </SelectItem>
                    <SelectItem value="discussion">
                      💭 Chaotic Discussion
                    </SelectItem>
                    <SelectItem value="announcement">
                      📢 Erisian Proclamation
                    </SelectItem>
                    <SelectItem value="apple">🍎 Golden Apple Topic</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="title"
                  placeholder="What chaos shall you unleash today?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 border-2 border-orange-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-lg font-medium focus:border-orange-500"
                />
              </div>
              <p className="text-sm text-purple-600 italic">
                🍎 Remember: &quot;Nothing is true, everything is
                permitted&quot; - make it chaotic!
              </p>
            </div>

            {/* Discordian Tabs */}
            <Tabs defaultValue="discussion" className="w-full">
              <TabsList className="grid w-64 grid-cols-2 border-2 border-purple-300 bg-gradient-to-r from-purple-200 to-pink-200">
                <TabsTrigger
                  value="discussion"
                  className="font-bold data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  🗣️ Chaos Discussion
                </TabsTrigger>
                <TabsTrigger
                  value="poll"
                  className="font-bold data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  📊 Erisian Poll
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discussion" className="mt-6">
                {/* Chaotic Message Section */}
                <div className="space-y-3 rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-4">
                  <Label className="flex items-center gap-2 text-lg font-bold text-orange-800">
                    📝 Your Chaotic Message:
                    <Badge
                      variant="outline"
                      className="animate-pulse border-purple-400 text-purple-600"
                    >
                      Let Chaos Flow
                    </Badge>
                  </Label>

                  {/* Erisian Rich Text Editor Toolbar */}
                  <div className="border-gradient-to-r overflow-hidden rounded-xl border-4 bg-white from-purple-300 to-pink-300 shadow-lg">
                    <div className="flex flex-wrap items-center gap-1 border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 p-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-purple-200"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-purple-200"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-purple-200"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-purple-200"
                        >
                          <Strikethrough className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mx-2 h-8 w-px bg-gradient-to-b from-purple-300 to-pink-300" />

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-orange-200"
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-orange-200"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mx-2 h-8 w-px bg-gradient-to-b from-orange-300 to-red-300" />

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-pink-200"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-pink-200"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-pink-200"
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:scale-110 hover:bg-pink-200"
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        <Badge className="animate-pulse bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          🍎 Eris Watching
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 border-2 border-green-300 bg-gradient-to-r from-green-100 to-blue-100 px-4 font-medium transition-all hover:scale-105"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Chaos Preview
                        </Button>
                      </div>
                    </div>

                    <Textarea
                      placeholder="Unleash your inner chaos here... Let Eris guide your words! Remember: confusion is the beginning of wisdom 🌪️"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="to-purple-25 min-h-[350px] resize-none rounded-none border-0 bg-gradient-to-br from-white p-4 text-lg focus-visible:ring-0"
                    />
                  </div>

                  {/* Chaotic Attach Files */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100 font-medium transition-all hover:scale-105"
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      🔗 Attach Chaotic Files
                    </Button>
                    <p className="text-sm text-purple-600 italic">
                      ⚡ Channel your inner Discordian spirit!
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="poll">
                <div className="rounded-xl border-4 border-purple-300 bg-gradient-to-br from-purple-100 to-pink-100 p-8 text-center">
                  <Sparkles className="mx-auto mb-4 h-16 w-16 animate-spin text-purple-500" />
                  <h3 className="mb-2 text-xl font-bold text-purple-700">
                    🗳️ Erisian Poll Creation
                  </h3>
                  <p className="text-purple-600">
                    Create polls to spread more confusion and chaos!
                    <br />
                    <em>
                      &quot;The best way to worship Eris is to create more
                      questions than answers&quot;
                    </em>
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Chaotic Tags and Options Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Erisian Tags */}
              <div className="space-y-3 rounded-lg border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50 p-4">
                <Label
                  htmlFor="tags"
                  className="flex items-center gap-2 text-lg font-bold text-green-800"
                >
                  🏷️ Chaos Tags:
                  <Badge
                    variant="outline"
                    className="border-green-400 text-green-600"
                  >
                    Organize Chaos
                  </Badge>
                </Label>
                <Input
                  id="tags"
                  placeholder="chaos, discord, eris, golden-apple, confusion..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="border-2 border-green-400 bg-gradient-to-r from-green-50 to-blue-50 font-medium focus:border-blue-500"
                />
                <p className="text-sm text-green-700 italic">
                  🍎 Multiple tags may be separated by commas - spread the chaos
                  efficiently!
                </p>
              </div>

              {/* Discordian Options */}
              <div className="space-y-4 rounded-lg border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 p-4">
                <Label className="flex items-center gap-2 text-lg font-bold text-pink-800">
                  ⚙️ Erisian Options:
                  <Badge
                    variant="outline"
                    className="animate-pulse border-pink-400 text-pink-600"
                  >
                    Customize Chaos
                  </Badge>
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 rounded bg-white/50 p-2">
                    <Checkbox
                      id="watch-thread"
                      checked={watchThread}
                      onCheckedChange={handleWatchThreadChange}
                      className="border-2 border-pink-400"
                    />
                    <Label
                      htmlFor="watch-thread"
                      className="text-sm font-medium text-pink-800"
                    >
                      👁️ Watch this chaotic thread unfold...
                    </Label>
                  </div>
                  <div className="ml-8 flex items-center space-x-3 rounded bg-white/30 p-2">
                    <Checkbox
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={handleEmailNotificationsChange}
                      className="border-2 border-purple-400"
                    />
                    <Label
                      htmlFor="email-notifications"
                      className="text-sm font-medium text-purple-800"
                    >
                      📧 and receive chaotic email notifications
                    </Label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-pink-600 italic">
                  🌪️ Stay updated on the beautiful chaos you&apos;ve created!
                </p>
              </div>
            </div>

            {/* Epic Chaos Submit Button */}
            <div className="flex flex-col items-center space-y-4 pt-6">
              <div className="mb-4 text-center">
                <p className="mb-2 text-lg font-bold text-purple-800">
                  🌟 Ready to Unleash Chaos Upon the World? 🌟
                </p>
                <p className="text-sm text-gray-600 italic">
                  &quot;Remember: We Discordians must stick apart!&quot; -
                  Malaclypse the Younger
                </p>
              </div>

              <Button
                type="submit"
                className="transform border-4 border-yellow-400 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 px-12 py-4 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700"
              >
                <Zap className="mr-2 h-6 w-6 animate-pulse" />
                🍎 UNLEASH ERISIAN CHAOS 🍎
                <Sparkles className="ml-2 h-6 w-6 animate-spin" />
              </Button>

              <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Apple className="h-3 w-3" />
                  Golden Apple Blessed
                </span>
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Eris Approved
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Sacred Chao Certified
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Final Discordian Footer */}
        <div className="mt-8 text-center">
          <div className="border-gradient-to-r rounded-xl border-4 bg-gradient-to-r from-purple-100 from-purple-300 via-pink-100 to-orange-100 to-pink-300 p-6">
            <h3 className="mb-3 flex items-center justify-center gap-2 text-xl font-bold text-gray-800">
              <Sparkles className="animate-pulse" />
              🌪️ The Discordian Society Welcomes Your Chaos! 🌪️
              <Sparkles className="animate-pulse" />
            </h3>
            <p className="mb-4 text-sm text-gray-600 italic">
              &quot;All statements are true in some sense, false in some sense,
              meaningless in some sense, true and false in some sense, true and
              meaningless in some sense, false and meaningless in some sense,
              and true and false and meaningless in some sense.&quot; -
              Principia Discordia
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Apple className="h-4 w-4 text-green-500" />
                🍎 Golden Apple
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />⚡ Sacred Chao
              </span>
              <span className="flex items-center gap-1">
                <Crown className="h-4 w-4 text-purple-500" />
                👑 Erisian Crown
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-pink-500" />
                🌈 Discordian Rainbow
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostThread;
