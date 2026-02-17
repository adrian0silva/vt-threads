"use client";

import {
  HelpCircle,
  ImageIcon,
  MessageSquare,
  Plus,
  Send,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import type React from "react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { Input } from "./ui/input";

export interface ReplyFormHandle {
  replyTo: (username: string, content: string) => void;
}

interface ReplyFormProps {
  threadId: string;
  userId?: string;
  isAuthenticated: boolean;
  forum: string;
}

export const ReplyForm = forwardRef<ReplyFormHandle, ReplyFormProps>(
  ({ threadId, userId, isAuthenticated, forum }, ref) => {
    const [content, setContent] = useState("");
    const [images, setImages] = useState<Array<{ url: string; alt?: string }>>(
      [],
    );
    const [videos, setVideos] = useState<
      Array<{ id: string; title?: string; platform: "youtube" }>
    >([]);
    const [embeds, setEmbeds] = useState<
      Array<{ id: string; url: string; platform: "twitter" }>
    >([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => ({
      replyTo(username: string, postContent: string) {
        const quoted =
          `[quote=${username}]${postContent}[/quote]\n\n`;
        setContent(quoted);

        setTimeout(() => {
          textAreaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          textAreaRef.current?.focus();
        }, 50);
      },
    }));

    const [newImageUrl, setNewImageUrl] = useState("");
    const [newImageAlt, setNewImageAlt] = useState("");
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [newEmbedUrl, setNewEmbedUrl] = useState("");

    const extractYoutubeId = (url: string): string | null => {
      const regex =
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const extractTweetId = (url: string): string | null => {
      const regex =
        /twitter\.com\/\w+\/status\/(\d+)|x\.com\/\w+\/status\/(\d+)/;
      const match = url.match(regex);
      return match ? match[1] || match[2] : null;
    };

    const addImage = () => {
      if (newImageUrl.trim()) {
        setImages([
          ...images,
          { url: newImageUrl.trim(), alt: newImageAlt.trim() || undefined },
        ]);
        setNewImageUrl("");
        setNewImageAlt("");
      }
    };

    const addVideo = () => {
      const videoId = extractYoutubeId(newVideoUrl);
      if (videoId) {
        setVideos([...videos, { id: videoId, platform: "youtube" }]);
        setNewVideoUrl("");
      }
    };

    const addEmbed = () => {
      const tweetId = extractTweetId(newEmbedUrl);
      if (tweetId) {
        setEmbeds([
          ...embeds,
          { id: tweetId, url: newEmbedUrl.trim(), platform: "twitter" },
        ]);
        setNewEmbedUrl("");
      }
    };

    const removeImage = (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    };

    const removeVideo = (index: number) => {
      setVideos(videos.filter((_, i) => i !== index));
    };

    const removeEmbed = (index: number) => {
      setEmbeds(embeds.filter((_, i) => i !== index));
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!content.trim()) return;

      setIsSubmitting(true);

      try {
        const res = await fetch(`/api/threads/${forum}/add-reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
            threadId,
            userId,
          }),
        });

        if (res.ok) {
          setContent("");
          // Refresh the page to show the new post
          window.location.reload();
        } else {
          const data = await res.json();
          alert("Error: " + (data.error || "Failed to create post"));
        }
      } catch (error) {
        alert("Error: Failed to create post");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isAuthenticated) {
      return (
        <Card className="mt-8 border border-gray-200 bg-gray-50 p-6 text-center">
          <div className="mb-4 flex items-center justify-center">
            <MessageSquare className="mr-2 h-8 w-8 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Participe da Discussão!
            </h3>
          </div>
          <p className="mb-4 text-gray-700">
            Você precisa fazer login ou se registrar para responder a este
            tópico.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Entrar
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Registrar
            </Button>
          </div>
        </Card>
      );
    }
    const hasContent =
      content.trim() ||
      images.length > 0 ||
      videos.length > 0 ||
      embeds.length > 0;
    const insertBBCode = (tag: string, placeholder = "") => {
      const textarea = document.getElementById(
        "post-content",
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const replacement = selectedText || placeholder;

      const newContent =
        content.substring(0, start) +
        `[${tag}]${replacement}[/${tag}]` +
        content.substring(end);

      setContent(newContent);

      // Reposicionar cursor
      setTimeout(() => {
        const newPosition = start + tag.length + 2 + replacement.length;
        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    };
    return (
      <Card className="w-full border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-bold text-gray-900">
              Criar Resposta
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="post-content"
                className="text-sm font-medium text-gray-700"
              >
                Conteúdo
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                className="gap-1 text-xs text-gray-600 hover:text-gray-800"
              >
                <HelpCircle className="h-3 w-3" />
                BBCode
              </Button>
            </div>

            <Collapsible open={showHelp} onOpenChange={setShowHelp}>
              <CollapsibleContent className="mb-3">
                <div className="bg-muted space-y-2 rounded-md p-3 text-sm">
                  <p className="font-medium">
                    Use BBCode para adicionar mídia:
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
                    <div>
                      <code className="bg-background rounded px-1">
                        [img]URL_DA_IMAGEM[/img]
                      </code>
                      <p className="text-muted-foreground">Para imagens</p>
                    </div>
                    <div>
                      <code className="bg-background rounded px-1">
                        [youtube]ID_OU_URL[/youtube]
                      </code>
                      <p className="text-muted-foreground">
                        Para vídeos do YouTube
                      </p>
                    </div>
                    <div>
                      <code className="bg-background rounded px-1">
                        [twitter]ID_OU_URL[/twitter]
                      </code>
                      <p className="text-muted-foreground">Para tweets</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Exemplo: Texto normal
                    [img]https://exemplo.com/foto.jpg[/img] mais texto
                    [youtube]dQw4w9WgXcQ[/youtube]
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Textarea
              ref={textAreaRef}
              id="post-content"
              placeholder="Escreva sua resposta aqui... Use [img]URL[/img] para imagens, [youtube]ID[/youtube] para vídeos do YouTube, [twitter]URL[/twitter] para tweets"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none border-gray-200 font-mono text-sm focus:border-gray-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertBBCode("img", "URL_DA_IMAGEM")}
              className="border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
            >
              🖼️ + Imagem
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertBBCode("youtube", "ID_OU_URL_YOUTUBE")}
              className="border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
            >
              📺 + Vídeo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertBBCode("twitter", "URL_DO_TWEET")}
              className="border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
            >
              🐦 + Tweet
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!hasContent || isSubmitting}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Enviando..." : "Enviar Resposta"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
);

ReplyForm.displayName = "ReplyForm";
