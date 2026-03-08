import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ThreadsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  per: number;
  basePath: string;
  /** Optional query params to preserve (e.g. filter) */
  queryParams?: Record<string, string>;
}

function buildPageUrl(
  basePath: string,
  page: number,
  per: number,
  queryParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(queryParams);
  if (page > 1) params.set("page", String(page));
  if (per !== 20) params.set("per", String(per));
  const q = params.toString();
  const sep = basePath.includes("?") ? "&" : "?";
  return q ? `${basePath}${sep}${q}` : basePath;
}

export function ThreadsPagination({
  currentPage,
  totalPages,
  totalItems,
  per,
  basePath,
  queryParams,
}: ThreadsPaginationProps) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * per + 1;
  const end = Math.min(currentPage * per, totalItems);

  const build = (page: number) => buildPageUrl(basePath, page, per, queryParams);
  const prevUrl = currentPage > 1 ? build(currentPage - 1) : null;
  const nextUrl = currentPage < totalPages ? build(currentPage + 1) : null;

  const showPages = 5;
  let pageStart = Math.max(1, currentPage - Math.floor(showPages / 2));
  const pageEnd = Math.min(totalPages, pageStart + showPages - 1);
  if (pageEnd - pageStart + 1 < showPages) {
    pageStart = Math.max(1, pageEnd - showPages + 1);
  }
  const pageNumbers = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, i) => pageStart + i,
  );

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Mostrando <span className="font-medium">{start}</span>–
        <span className="font-medium">{end}</span> de{" "}
        <span className="font-medium">{totalItems}</span> tópicos
      </p>
      <div className="flex items-center gap-2">
        {prevUrl ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={prevUrl as never}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
        )}

        <div className="flex items-center gap-1">
          {pageStart > 1 && (
            <>
              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <Link href={build(1) as never}>1</Link>
              </Button>
              {pageStart > 2 && <span className="px-1 text-gray-400">…</span>}
            </>
          )}
          {pageNumbers.map((n) =>
            n === currentPage ? (
              <Button
                key={n}
                variant="default"
                size="icon"
                className="h-8 w-8"
                disabled
              >
                {n}
              </Button>
            ) : (
              <Button
                key={n}
                variant="outline"
                size="icon"
                className="h-8 w-8"
                asChild
              >
                <Link href={build(n) as never}>{n}</Link>
              </Button>
            ),
          )}
          {pageEnd < totalPages && (
            <>
              {pageEnd < totalPages - 1 && (
                <span className="px-1 text-gray-400">…</span>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                asChild
              >
                <Link href={build(totalPages) as never}>
                  {totalPages}
                </Link>
              </Button>
            </>
          )}
        </div>

        {nextUrl ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={nextUrl as never}>
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
