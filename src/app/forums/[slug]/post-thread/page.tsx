"use client";

import { ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import type { Forum } from "@/types/forum";

const PostThreadContent = () => {
  const router = useRouter();
  const params = useParams();
  const forumSlug = params.slug as string;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [forumEncontrado, setForumEncontrado] = useState<Forum | null>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    async function fetchForum() {
      const forum = await fetch(`/api/forums/${forumSlug}`).then((res) =>
        res.json(),
      );
      setForumEncontrado(forum);
    }
    fetchForum();
  }, [forumSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: message,
        forumId: forumEncontrado?.id,
        userId: session?.user.id,
      }),
    });

    if (res.ok) {
      router.push(`/forums/${forumSlug}`);
      setTitle("");
      setMessage("");
    } else {
      const data = await res.json();
      alert("Erro: " + (data.error ?? "ao criar tópico"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl p-6">
        {/* Navegação */}
        <nav className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/forums"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Fóruns
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={forumSlug ? `/forums/${forumSlug}` : "#"}
            className="flex items-center gap-1 hover:text-foreground"
          >
            {forumEncontrado?.title ?? "…"}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Criar tópico</span>
        </nav>

        <div className="border-border overflow-hidden rounded-lg border bg-card">
          <div className="bg-primary text-primary-foreground px-6 py-4">
            <h1 className="text-xl font-bold">Criar tópico</h1>
            <p className="mt-1 text-sm opacity-90">
              Mantenha o respeito e contribua com conteúdo de qualidade.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Digite o título do tópico"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Escreva sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="border-border min-h-[220px] resize-y"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link href={forumSlug ? `/forums/${forumSlug}` : "/forums"}>
                  Cancelar
                </Link>
              </Button>
              <Button
                type="submit"
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Criar tópico
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function PostThread() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center p-8 text-muted-foreground">
          Carregando...
        </div>
      }
    >
      <PostThreadContent />
    </Suspense>
  );
}
