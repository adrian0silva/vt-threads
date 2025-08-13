"use client";

import { forumTable } from "@/db/schema";

import ForumItem from "./forum-item";

interface ForumListProps {
  category: string;
  categoryValue: "GAMING" | "POLITICA" | "VALE_TUDO"; // para decidir cor
  forums: (typeof forumTable.$inferSelect)[];
}

const ForumList = ({ category, categoryValue, forums }: ForumListProps) => {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
        {category}
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {forums.map((forum) => (
          <ForumItem
            key={forum.id}
            forum={forum}
            color={
              categoryValue === "GAMING"
                ? "teal"
                : categoryValue === "POLITICA"
                ? "purple"
                : "orange"
            }
          />
        ))}
      </div>
    </section>
  );
};

export default ForumList;
