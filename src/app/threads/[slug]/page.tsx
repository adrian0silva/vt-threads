import { eq } from "drizzle-orm";
import { ChevronRight, Clock, Eye, MessageSquare, User } from "lucide-react";
import { headers } from "next/headers";

import { ReplyForm } from "@/components/reply-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { postTable, threadTable, userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface ThreadPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { slug } = await params;

  const threadQuery = db
    .select({
      id: threadTable.id,
      title: threadTable.title,
      slug: threadTable.slug,
      description: threadTable.description,
      views: threadTable.views,
      userId: threadTable.userId,
      userName: userTable.name,
      userAvatar: userTable.image,
      createdAt: threadTable.createdAt,
    })
    .from(threadTable)
    .leftJoin(userTable, eq(threadTable.userId, userTable.id))
    .where(eq(threadTable.slug, slug))
    .limit(1);

  const [thread] = await threadQuery.execute();

  if (!thread) throw new Error("Thread não encontrada");

  const postsQuery = db
    .select({
      id: postTable.id,
      content: postTable.content,
      createdAt: postTable.createdAt,
      userName: userTable.name,
      userAvatar: userTable.image,
      userId: postTable.userId,
    })
    .from(postTable)
    .leftJoin(userTable, eq(postTable.userId, userTable.id))
    .where(eq(postTable.threadId, thread.id))
    .orderBy(postTable.createdAt);

  const posts = await postsQuery.execute();

  const initialPost = {
    id: `thread-${thread.id}`,
    author: thread.userName || "Anonymous",
    title: "Member",
    joinDate: "Unknown",
    posts: "0",
    likes: "0",
    content: thread.description || "",
    timestamp: new Date(thread.createdAt).toLocaleString(),
    isOriginalPoster: true,
    userAvatar: thread.userAvatar,
  };

  const displayPosts = [
    initialPost,
    ...posts.map((post) => ({
      id: post.id,
      author: post.userName || "Anonymous",
      title: "Member",
      joinDate: "Unknown",
      posts: "0",
      likes: "0",
      content: post.content,
      timestamp: new Date(post.createdAt).toLocaleString(),
      isOriginalPoster: post.userId === thread.userId,
      userAvatar: post.userAvatar,
    })),
  ];

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Browser Warning */}
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
        <a href="#" className="hover:text-blue-600">
          Forums
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="#" className="hover:text-blue-600">
          Community Central
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="#" className="hover:text-blue-600">
          Vale Tudo
        </a>
      </nav>

      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold">{thread.title}</h1>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Thread starter</span>
              <a href="#" className="font-medium text-blue-600 hover:underline">
                {thread.userName || "Anonymous"}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Start date</span>
            <span>38 minutes ago</span>
          </div>
        </div>
      </div>

      {/* Posts */}
      {displayPosts.length > 0 ? (
        <div className="space-y-4">
          {displayPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden p-0">
              <div className="flex">
                {/* User Info Sidebar */}
                <div className="w-48 border-r bg-gray-50 p-4">
                  <div className="text-center">
                    <Avatar className="mx-auto mb-2 h-16 w-16">
                      <AvatarImage
                        src={
                          post.userAvatar ||
                          `/placeholder.svg?height=64&width=64&query=${post.author}`
                        }
                      />
                      <AvatarFallback>
                        {post.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="cursor-pointer font-semibold text-blue-600 hover:underline">
                      {post.author}
                    </h3>
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {post.title}
                    </Badge>
                    {post.isOriginalPoster && (
                      <Badge
                        variant="default"
                        className="mb-2 bg-green-600 text-xs"
                      >
                        OP
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-gray-600">
                    <div>Joined: {post.joinDate}</div>
                    <div>Posts: {post.posts}</div>
                    <div>Likes: {post.likes}</div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex-1 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {post.timestamp}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line">{post.content}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            No posts yet
          </h3>
          <p className="text-gray-500">Be the first to reply to this thread!</p>
        </Card>
      )}

      <ReplyForm
        threadId={thread.id}
        userId={session?.user?.id}
        isAuthenticated={!!session?.user}
        forum={slug}
      />

      {/* Thread Stats */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{thread.views || 1247} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{displayPosts.length} replies</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span>Share:</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-xs">
              Facebook
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Twitter
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Reddit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
