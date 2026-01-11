"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Forum = {
  id: string;
  title: string;
};

export function CreateThread({ forums }: { forums: Forum[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      forumId: formData.get("forumId"),
      title: formData.get("title"),
      description: formData.get("content"),
    };

    const res = await fetch("/api/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return;
    }
    router.refresh();
  }
  return (
    <>
      <Button
        onClick={() => setOpen((v) => !v)}
        className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 font-medium text-white shadow-lg hover:from-orange-600 hover:to-red-600 sm:px-6 sm:py-3"
        size="lg"
      >
        <PlusIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-sm sm:text-base">Criar Tópico</span>
      </Button>

      {open && (
        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fórum */}
            <div>
              <label className="mb-1 block text-sm font-medium">Fórum</label>
              <select
                name="forumId"
                className="w-full rounded border p-2"
                required
              >
                <option value="">Selecione um fórum</option>
                {forums.map((forum) => (
                  <option key={forum.id} value={forum.id}>
                    {forum.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Título do tópico
              </label>
              <input
                type="text"
                name="title"
                className="w-full rounded border p-2"
                required
              />
            </div>

            {/* Texto */}
            <div>
              <label className="mb-1 block text-sm font-medium">Conteúdo</label>
              <textarea
                name="content"
                rows={5}
                className="w-full rounded border p-2"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Publicar</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
}
