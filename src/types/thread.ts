import type { Post } from "./post";

export interface ThreadListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: Date;
  views: number;
  lastPostAt: Date;
  postsCount: number;
  lastReadAt: Date | null;
  isUnread: boolean;
  userName: string | null;
  userAvatar: string | null;
  lastPostUserName: string | null;
  lastPostUserAvatar: string | null;
}

export interface ThreadBySlug {
  id: string;
  title: string;
  slug: string;
  description: string;
  views: number;
  userId: string;
  forumId: string;
  userName: string | null;
  userAvatar: string | null;
  createdAt: Date;
  forumSlug: string;
  forumTitle: string;
}

export interface ThreadHeaderInfo {
  title: string;
  userName: string | null;
  createdAt: Date;
}

export interface ThreadClientProps {
  posts: Post[];
  threadId: string;
  threadSlug: string;
  forumSlug: string;
  forumTitle: string;
  userId: string;
  isAuthenticated: boolean;
  thread: ThreadHeaderInfo;
}
