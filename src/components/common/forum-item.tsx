import Link from "next/link";

import { forumTable } from "@/db/schema";
import { cn } from "@/lib/utils";

interface ForumItemProps {
  forum: typeof forumTable.$inferSelect;
  textContainerClassName?: string;
  color: "teal" | "purple" | "orange";
}

const ForumItem = ({
  forum,
  textContainerClassName,
  color,
}: ForumItemProps) => {
  const colorClasses =
    color === "teal"
      ? "border-teal-500 hover:bg-teal-50"
      : color === "purple"
        ? "border-purple-500 hover:bg-purple-50"
        : "border-orange-500 hover:bg-orange-50";

  return (
    <Link
      href={`/forums/${forum.slug}`}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 transition-colors",
        colorClasses,
      )}
    >
      <div className={cn("flex flex-col gap-1", textContainerClassName)}>
        <p className="truncate text-base font-semibold hover:underline">
          {forum.title}
        </p>
        <p className="text-muted-foreground truncate text-sm">
          {forum.description}
        </p>
      </div>

      <div className="text-muted-foreground flex justify-between text-xs">
        <span>Threads: 0</span>
        <span>Posts: 0</span>
      </div>

      <div className="text-muted-foreground text-xs">
        Última: — {/* Aqui depois dá pra puxar last user/post */}
      </div>
    </Link>
  );
};

export default ForumItem;
