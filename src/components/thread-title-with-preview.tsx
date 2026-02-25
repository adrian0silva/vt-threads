"use client";

import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const PREVIEW_MAX_LENGTH = 180;

function stripBBCode(text: string): string {
  return text.replace(/\[\/?[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
}

export function ThreadTitleWithPreview({
  title,
  description,
  slug,
  isUnread,
}: {
  title: string;
  description: string;
  slug: string;
  isUnread: boolean;
}) {
  const preview =
    description.length > PREVIEW_MAX_LENGTH
      ? stripBBCode(description).slice(0, PREVIEW_MAX_LENGTH) + "…"
      : stripBBCode(description);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/threads/${slug}`}>
          <h3
            className={cn(
              "text-black-900 mb-1 line-clamp-2 text-base font-bold transition-colors hover:text-blue-600 hover:underline sm:text-lg",
              isUnread ? "font-bold text-black" : "font-normal text-gray-600",
            )}
          >
            {title}
          </h3>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm whitespace-pre-wrap">
        {preview || title}
      </TooltipContent>
    </Tooltip>
  );
}
