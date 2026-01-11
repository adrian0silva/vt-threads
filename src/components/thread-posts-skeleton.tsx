import { Skeleton } from "@/components/ui/skeleton";

export function ThreadPostsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex overflow-hidden rounded-lg border border-gray-200 bg-white"
        >
          {/* Desktop Sidebar Skeleton */}
          <div className="hidden w-48 border-r bg-gray-50 p-4 md:block">
            <Skeleton className="mx-auto mb-2 h-36 w-36" />
            <Skeleton className="mx-auto h-5 w-24" />
          </div>
          
          {/* Content Skeleton */}
          <div className="flex-1 p-4">
            <div className="mb-4 flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
