import { Clock, MessageSquare, User } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

import { CreateThread } from "@/components/create-thread";
import { HomeSkeleton } from "@/components/home-skeleton";
import { RightRail } from "@/components/right-rail";
import { ThreadTitleWithPreview } from "@/components/thread-title-with-preview";
import { ThreadsPagination } from "@/components/threads-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import * as forumService from "@/services/forum.service";
import * as threadService from "@/services/thread.service";
import type { FilterType } from "@/types/filters";

const DEFAULT_PER = 20;

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; per?: string; filter?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page ?? "1", 10) || 1);
  const per = Math.min(
    100,
    Math.max(1, parseInt(params?.per ?? String(DEFAULT_PER), 10) || DEFAULT_PER)
  );
  const filter = (params?.filter as FilterType) || "all";

  const [forums, listResult] = await Promise.all([
    forumService.listForums(),
    threadService.listThreads({
      filter,
      page,
      per,
      sessionUserId: session?.user?.id ?? null,
    }),
  ]);

  const {
    threads,
    totalCount,
    totalPages,
    currentPage,
  } = listResult;

  const basePath = "/";
  const filterParams = (f: string) =>
    f === "all" ? basePath : `${basePath}?filter=${f}`;

  return (
    <>
      <div className="mb-6">
        {session?.user && <CreateThread forums={forums} />}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={filterParams("all") as never}
          className={cn(
            "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
            filter === "all"
              ? "bg-foreground text-background"
              : "bg-card text-foreground hover:bg-muted"
          )}
        >
          Todos
        </Link>
        {session?.user && (
          <>
            <Link
              href={`${basePath}?filter=answered-by-me`}
              className={cn(
                "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
                filter === "answered-by-me"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              Respondidos por mim
            </Link>
            <Link
              href={`${basePath}?filter=viewed-by-me`}
              className={cn(
                "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
                filter === "viewed-by-me"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              Visualizadas por mim
            </Link>
          </>
        )}
        <Link
          href={`${basePath}?filter=unanswered`}
          className={cn(
            "border-2 border-foreground px-3 py-1.5 text-sm font-medium transition-colors",
            filter === "unanswered"
              ? "bg-foreground text-background"
              : "bg-card text-foreground hover:bg-muted"
          )}
        >
          Sem respostas
        </Link>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {threads.length === 0 ? (
          <div className="bg-muted/50 border-border rounded-lg border py-12 text-center">
            <div className="mb-4">
              <MessageSquare className="text-muted-foreground mx-auto h-16 w-16" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-bold">
              Ainda não há tópicos
            </h3>
            <p className="text-muted-foreground mb-4">
              Este fórum aguarda seu primeiro tópico de discussão!
            </p>
            <p className="text-muted-foreground text-sm">
              Seja o primeiro a iniciar uma discussão.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4">
            {threads.map((thread) => (
              <Card
                key={thread.id}
                className="chaos-card bg-card transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                      <Avatar className="border-border h-10 w-10 flex-shrink-0 rounded-none border sm:h-12 sm:w-12">
                        <AvatarImage
                          src={thread.userAvatar || "/placeholder.svg"}
                          alt={thread.userName || "Usuário"}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {thread.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="sm:hidden">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-foreground">
                            {thread.userName || "Usuário Anônimo"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2">
                        <ThreadTitleWithPreview
                          title={thread.title}
                          description={thread.description}
                          slug={thread.slug}
                          isUnread={thread.isUnread}
                        />
                      </div>
                      <div className="text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:gap-3">
                        <div className="hidden items-center gap-1 sm:flex">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-foreground">
                            {thread.userName || "Usuário Anônimo"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(thread.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                        {thread.postsCount > 0 && thread.lastPostAt && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>
                              Última resposta
                              {thread.lastPostUserName
                                ? ` por ${thread.lastPostUserName}`
                                : ""}{" "}
                              em{" "}
                              {new Date(thread.lastPostAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm sm:flex-col sm:gap-6">
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1 flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Respostas:</span>
                          <span className="sm:hidden">Resp:</span>
                        </div>
                        <div className="text-foreground text-lg font-bold">
                          {thread.postsCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <ThreadsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              per={per}
              basePath="/"
              queryParams={filter !== "all" ? { filter } : undefined}
            />
          </div>
        )}

        <aside className="lg:w-80">
          <RightRail />
        </aside>
      </div>
    </>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; per?: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="mb-8 text-center">
        <h1 className="chaos-heading mb-2 text-4xl font-bold md:text-5xl">
          VT Forums
        </h1>
        <p className="text-muted-foreground text-lg">Bem-vindo ao fórum</p>
        <p className="text-accent mt-1 text-sm font-medium uppercase tracking-widest">
          All Hail Eris! All Hail Discordia!
        </p>
      </div>
      <h2 className="text-foreground mb-4 text-2xl font-bold">
        Fóruns de Discussão
      </h2>
      <p className="text-muted-foreground mb-6">
        Participe de discussões sobre diversos temas. Mantenha o respeito e
        contribua com conteúdo de qualidade.
      </p>

      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
