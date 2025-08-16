"use client"

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eye,
  ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Paperclip,
  Quote,
  Redo,
  Strikethrough,
  Table,
  Underline,
  Undo,
} from "lucide-react"
import { useParams,useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/db";
import { threadTable } from "@/db/schema"
import { authClient } from "@/lib/auth-client"
interface Forum {
    id: string
    title: string
    slug: string
    // outras propriedades...
  }

const PostThread = () => {
  const router = useRouter()
  const params = useParams()
  const forumSlug = params.slug

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [tags, setTags] = useState("")
  const [watchThread, setWatchThread] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [forumEncontrado, setForumEncontrado] = useState<Forum | null>(null)
  const {data: session} = authClient.useSession();
  console.log('forumSlug')
  console.log(forumSlug)
  useEffect(() => {
    async function fetchForum() {
      const forum = await fetch(`/api/forums/${forumSlug}`).then(res => res.json())
      setForumEncontrado(forum)
    }
    fetchForum()
  }, [forumSlug])

  console.log('forumEncontrado')
  console.log(forumEncontrado)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, message, tags, watchThread, emailNotifications })
    console.log('forumEncontrado')
    console.log(forumEncontrado)
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
        router.push(`/forums/${forumSlug}`)
        setTitle("");
        setMessage("");
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gray-200 px-4 py-3 mb-6 rounded-t-lg">
        <h1 className="text-lg font-medium text-gray-800">Post thread</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        {/* Breadcrumb */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Forums</span>
            <span>›</span>
            <span className="hover:text-blue-600 cursor-pointer">Community Central</span>
            <span>›</span>
            <span className="text-gray-800">Vale Tudo</span>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title:
            </Label>
            <div className="flex gap-2">
              <Select defaultValue="no-prefix">
                <SelectTrigger className="w-32 bg-gray-100 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-prefix">(No prefix)</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="discussion">Discussion</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="title"
                placeholder="Thread title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-gray-50 border-gray-300"
              />
            </div>
          </div>

          {/* Discussion/Poll Tabs */}
          <Tabs defaultValue="discussion" className="w-full">
            <TabsList className="grid w-32 grid-cols-2 bg-gray-100">
              <TabsTrigger value="discussion" className="text-xs">
                Discussion
              </TabsTrigger>
              <TabsTrigger value="poll" className="text-xs">
                Poll
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discussion" className="mt-4">
              {/* Message Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Message:</Label>

                {/* Rich Text Editor Toolbar */}
                <div className="border border-gray-300 rounded-lg bg-white">
                  <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Table className="h-4 w-4" />
                    </Button>
                    <div className="ml-auto flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Redo className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[300px] border-0 resize-none focus-visible:ring-0 rounded-none rounded-b-lg"
                  />
                </div>

                {/* Attach Files */}
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach files
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="poll">
              <div className="p-4 text-center text-gray-500">Poll creation interface would go here</div>
            </TabsContent>
          </Tabs>

          {/* Tags and Options Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                Tags:
              </Label>
              <Input
                id="tags"
                placeholder=""
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-gray-50 border-gray-300"
              />
              <p className="text-xs text-gray-500">Multiple tags may be separated by commas.</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Options:</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="watch-thread" checked={watchThread} onCheckedChange={setWatchThread} />
                  <Label htmlFor="watch-thread" className="text-sm text-gray-700">
                    Watch this thread...
                  </Label>
                </div>
                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                  <Label htmlFor="email-notifications" className="text-sm text-gray-700">
                    and receive email notifications
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button type="submit" className="bg-red-700 hover:bg-red-800 text-white px-8 py-2">
              Post thread
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostThread
