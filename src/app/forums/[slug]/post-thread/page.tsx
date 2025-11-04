"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronRight,
  Code,
  Eye,
  ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  MessageSquare,
  Paperclip,
  Quote,
  Redo,
  Strikethrough,
  Table,
  Underline,
  Undo,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

interface Forum {
  id: string;
  title: string;
  slug: string;
  // outras propriedades...
}

const PostThread = () => {
  const router = useRouter();
  const params = useParams();
  const forumSlug = params.slug;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState("");
  const [watchThread, setWatchThread] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
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
      alert("Error: " + data.error);
    }
  };

  const handleWatchThreadChange = (checked: boolean | "indeterminate") => {
    setWatchThread(checked === true);
  };

  const handleEmailNotificationsChange = (
    checked: boolean | "indeterminate",
  ) => {
    setEmailNotifications(checked === true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Criar Novo Tópico
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Compartilhe suas ideias e inicie uma discussão
          </p>
        </div>

        {/* Navigation */}
        <nav className="mb-6 flex items-center space-x-2 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
          <a
            href="#"
            className="flex items-center gap-1 transition-colors hover:text-blue-600"
          >
            <MessageSquare className="h-4 w-4" />
            Fóruns
          </a>
          <ChevronRight className="h-4 w-4" />
          <a
            href="#"
            className="flex items-center gap-1 transition-colors hover:text-blue-600"
          >
            <MessageSquare className="h-4 w-4" />
            {forumEncontrado?.title || "Fórum"}
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="flex items-center gap-1 font-medium text-gray-900">
            <MessageSquare className="h-4 w-4" />
            Criar Tópico
          </span>
        </nav>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                Criar Novo Tópico
              </h1>
            </div>
            <p className="mt-2 text-sm opacity-90">
              Mantenha o respeito e contribua com conteúdo de qualidade.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6">
            {/* Title Section */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Label
                htmlFor="title"
                className="flex items-center gap-2 text-lg font-bold text-gray-800"
              >
                Título do Tópico:
                <Badge
                  variant="outline"
                  className="border-blue-400 text-blue-600"
                >
                  Obrigatório
                </Badge>
              </Label>
              <div className="flex gap-3">
                <Select defaultValue="no-prefix">
                  <SelectTrigger className="w-40 border border-gray-300 bg-white font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-prefix">Sem prefixo</SelectItem>
                    <SelectItem value="question">Pergunta</SelectItem>
                    <SelectItem value="discussion">Discussão</SelectItem>
                    <SelectItem value="announcement">Anúncio</SelectItem>
                    <SelectItem value="topic">Tópico</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="title"
                  placeholder="Digite o título do tópico"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 border border-gray-300 bg-white text-lg font-medium focus:border-blue-500"
                />
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="discussion" className="w-full">
              <TabsList className="grid w-64 grid-cols-2 border border-gray-300 bg-white">
                <TabsTrigger
                  value="discussion"
                  className="font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Discussão
                </TabsTrigger>
                <TabsTrigger
                  value="poll"
                  className="font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Enquete
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discussion" className="mt-6">
                {/* Message Section */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <Label className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    Mensagem:
                  </Label>

                  {/* Rich Text Editor Toolbar */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <Strikethrough className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mx-2 h-8 w-px bg-gray-300" />

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mx-2 h-8 w-px bg-gray-300" />

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 transition-all hover:bg-gray-200"
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 border border-gray-300 bg-white px-4 font-medium hover:bg-gray-100"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Pré-visualizar
                        </Button>
                      </div>
                    </div>

                    <Textarea
                      placeholder="Escreva sua mensagem aqui..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[350px] resize-none rounded-none border-0 bg-white p-4 text-lg focus-visible:ring-0"
                    />
                  </div>

                  {/* Attach Files */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-gray-300 bg-white font-medium hover:bg-gray-50"
                    >
                      <Paperclip className="mr-2 h-4 w-4" />
                      Anexar Arquivos
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="poll">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                  <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-xl font-bold text-gray-700">
                    Criação de Enquete
                  </h3>
                  <p className="text-gray-600">
                    A funcionalidade de enquete estará disponível em breve.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Tags and Options Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Tags */}
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <Label
                  htmlFor="tags"
                  className="flex items-center gap-2 text-lg font-bold text-gray-800"
                >
                  Tags:
                </Label>
                <Input
                  id="tags"
                  placeholder="tags, separadas, por, vírgulas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="border border-gray-300 bg-white font-medium focus:border-blue-500"
                />
                <p className="text-sm text-gray-600">
                  Múltiplas tags podem ser separadas por vírgulas.
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <Label className="flex items-center gap-2 text-lg font-bold text-gray-800">
                  Opções:
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 rounded bg-white p-2">
                    <Checkbox
                      id="watch-thread"
                      checked={watchThread}
                      onCheckedChange={handleWatchThreadChange}
                      className="border border-gray-300"
                    />
                    <Label
                      htmlFor="watch-thread"
                      className="text-sm font-medium text-gray-800"
                    >
                      Acompanhar este tópico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded bg-white p-2">
                    <Checkbox
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={handleEmailNotificationsChange}
                      className="border border-gray-300"
                    />
                    <Label
                      htmlFor="email-notifications"
                      className="text-sm font-medium text-gray-800"
                    >
                      Receber notificações por email
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center space-y-4 pt-6">
              <Button
                type="submit"
                className="bg-blue-600 px-12 py-4 text-xl font-bold text-white shadow-lg transition-all hover:bg-blue-700"
              >
                Criar Tópico
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-sm text-gray-600">
              VT Forums - Fórum de Discussão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostThread;
