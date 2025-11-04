"use client"

import { Apple, Clock, Crown, Eye, MessageSquare, PlusIcon, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// --- Types ---
type Forum = {
  id: string
  title: string
  slug: string
}

type Thread = {
  id: string
  title: string
  slug: string
  description: string | null
  createdAt: string
  views: number
  postsCount: number
  userName?: string | null
  userAvatar?: string | null
}

type ThreadsResponse = {
  threads: Thread[]
  nextCursor: string | null
}

interface AllForumsClientProps {
  initialForums: Forum[]
  initialThreads: Thread[]
  initialCursor: string | null
}

function getChaosLevel(threadId: string): number {
  let hash = 0
  for (let i = 0; i < threadId.length; i++) {
    hash = (hash << 5) - hash + threadId.charCodeAt(i)
    hash = hash & hash
  }
  return (Math.abs(hash) % 10) + 1
}

export default function AllForumsClient({ initialForums, initialThreads, initialCursor }: AllForumsClientProps) {
  const [forums, setForums] = useState<Forum[]>(initialForums || [])
  const [selectedForum, setSelectedForum] = useState<string | "">("")
  const [threads, setThreads] = useState<Thread[]>(initialThreads || [])
  const [cursor, setCursor] = useState<string | null>(initialCursor || null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- Fetch threads ---
  async function fetchThreads(params: { forumId?: string; cursor?: string | null; append?: boolean }) {
    try {
      if (params.append) setLoadingMore(true)
      else setLoading(true)
      setError(null)

      const q = new URLSearchParams()
      if (params.forumId) q.set("forumId", params.forumId)
      if (params.cursor) q.set("cursor", params.cursor)

      const res = await fetch(`/api/threads?${q.toString()}`)
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
      const data: ThreadsResponse = await res.json()

      if (params.append) setThreads((t) => [...t, ...data.threads])
      else setThreads(data.threads)

      setCursor(data.nextCursor)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Unknown error")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // --- Reload threads on forum change ---
  useEffect(() => {
    fetchThreads({ forumId: selectedForum || undefined, cursor: null, append: false })
  }, [selectedForum])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 animate-pulse text-yellow-500" />
          <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
            All Chaos — Threads Across Forums
          </h1>
          <Sparkles className="h-6 w-6 animate-pulse text-yellow-500" />
        </div>
        <p className="text-sm text-gray-600 italic mt-2">
          Filtre por forum e carregue mais quando quiser — independente do forum.
        </p>
      </div>

      {/* Selector + Create Thread */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Selecione Forum</label>
          <select
            value={selectedForum}
            onChange={(e) => setSelectedForum(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="">— Todos os forums —</option>
            {forums.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </select>
        </div>
        <Link href="/threads/new">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <PlusIcon className="mr-2 h-4 w-4" /> Criar Thread
          </Button>
        </Link>
      </div>

      {/* Threads List */}
      <section className="space-y-4">
        {loading && <div className="text-center text-sm text-gray-500">Carregando threads...</div>}
        {error && <div className="text-center text-sm text-red-500">{error}</div>}

        {threads.length === 0 && !loading ? (
          <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 py-12 text-center">
            <div className="mb-4">
              <Apple className="mx-auto h-16 w-16 text-purple-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-purple-600">Ainda nao ha caos...</h3>
            <p className="text-sm text-purple-500">Tente selecionar outro forum ou crie a primeira thread.</p>
          </div>
        ) : (
          threads.map((thread) => (
            <Card
              key={thread.id}
              className="border-2 bg-gradient-to-r from-white to-purple-50 transition-all duration-300 hover:scale-[1.02] hover:border-purple-300 hover:shadow-lg"
            >
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-start">
                {/* Avatar */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                  <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-purple-300 sm:h-12 sm:w-12">
                    <AvatarImage
                      src={thread.userAvatar || "/placeholder.svg"}
                      alt={thread.userName || "Erisian User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {thread.title?.charAt(0)?.toUpperCase() || "E"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="sm:hidden">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Crown className="h-3 w-3" />
                      <span className="font-medium text-purple-600">{thread.userName || "Anon"}</span>
                    </div>
                  </div>
                </div>

                {/* Thread Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2">
                    <Link href={`/threads/${thread.slug}`}>
                      <h3 className="mb-1 line-clamp-2 text-base font-bold text-purple-800 transition-colors hover:text-purple-600 hover:underline sm:text-lg">
                        {thread.title}
                      </h3>
                    </Link>
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600">{thread.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-3">
                    <div className="hidden items-center gap-1 sm:flex">
                      <Crown className="h-3 w-3" />
                      <span className="font-medium text-purple-600">{thread.userName || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span suppressHydrationWarning>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="outline" className="border-orange-300 text-xs text-orange-600">
                      Chaos Level: {getChaosLevel(thread.id)}/10
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between gap-4 text-sm sm:flex-col sm:gap-6">
                  <div className="text-center">
                    <div className="mb-1 flex items-center gap-1 text-gray-500">
                      <MessageSquare className="h-4 w-4" /> <span className="hidden sm:inline">Replies:</span>
                    </div>
                    <div className="text-lg font-bold text-purple-700">{thread.postsCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 flex items-center gap-1 text-gray-500">
                      <Eye className="h-4 w-4" /> <span className="hidden sm:inline">Views:</span>
                    </div>
                    <div className="text-lg font-bold text-purple-700">{thread.views}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}

        {/* Load more */}
        <div className="flex justify-center">
          {cursor ? (
            <Button
              onClick={() => fetchThreads({ forumId: selectedForum || undefined, cursor, append: true })}
              disabled={loadingMore}
            >
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </Button>
          ) : (
            threads.length > 0 && <div className="text-sm text-gray-500">Voce chegou ao fim (por enquanto).</div>
          )}
        </div>
      </section>
    </div>
  )
}
