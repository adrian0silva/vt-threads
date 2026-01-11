import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ForumsListSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            {/* Category Header Skeleton */}
            <div className="rounded-lg bg-gray-200 p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Badge variant="secondary" className="bg-white/20 text-transparent">
                  <div className="h-3 w-12" />
                </Badge>
              </div>
              <Skeleton className="mt-2 h-4 w-64 opacity-50" />
            </div>

            {/* Forums Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Skeleton */}
      <aside className="lg:w-80">
        <Skeleton className="h-64 w-full rounded-lg" />
      </aside>
    </div>
  );
}
