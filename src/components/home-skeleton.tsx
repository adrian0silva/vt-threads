import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {/* Avatar Skeleton */}
              <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                <Skeleton className="h-10 w-10 sm:h-12 sm:w-12" />
                <div className="sm:hidden">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="min-w-0 flex-1">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="flex items-center gap-4 sm:flex-col sm:gap-6">
                <div className="text-center">
                  <Skeleton className="mb-1 h-4 w-20" />
                  <Skeleton className="mx-auto h-6 w-8" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Skeleton */}
      <aside className="lg:w-80">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </aside>
    </div>
  );
}
