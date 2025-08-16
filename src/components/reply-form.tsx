"use client"

import { MessageSquare } from "lucide-react"
import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ReplyFormProps {
  threadId: string
  userId?: string
  isAuthenticated: boolean,
  forum: string
}

export function ReplyForm({ threadId, userId, isAuthenticated, forum }: ReplyFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/threads/${forum}/add-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          threadId,
          userId,
        }),
      })

      if (res.ok) {
        setContent("")
        // Refresh the page to show the new post
        window.location.reload()
      } else {
        const data = await res.json()
        alert("Error: " + (data.error || "Failed to create post"))
      }
    } catch (error) {
      alert("Error: Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card className="mt-8 border-blue-200 bg-blue-50 p-6 text-center">
        <div className="mb-4 flex items-center justify-center">
          <MessageSquare className="mr-2 h-8 w-8 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Join the conversation!</h3>
        </div>
        <p className="mb-4 text-gray-700">You must log in or register to reply to this thread.</p>
        <div className="flex items-center justify-center space-x-3">
          <Button variant="outline">Log in</Button>
          <Button>Register</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mt-8 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="reply-content">Reply to this thread</Label>
          <Textarea
            id="reply-content"
            placeholder="Write your reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-2 min-h-[120px]"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Reply"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
