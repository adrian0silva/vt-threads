import { Skeleton } from "@/components/ui/skeleton";

export function ForumSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header Title Skeleton */}
        <div className="mb-6 text-center sm:mb-8">
          <Skeleton className="mx-auto h-8 w-32 sm:h-10" />
        </div>

        {/* Forum Header Skeleton */}
        <div className="rounded-lg bg-gray-200 p-4 shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <div className="mt-3 flex flex-row gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        {/* Threads List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                  <Skeleton className="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
