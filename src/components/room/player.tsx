"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRoomStore } from "@/store/room-store";

interface PlayerProps {
  onPlay: () => void;
  onPause: () => void;
}

export function Player({ onPlay, onPause }: PlayerProps) {
  const { currentTrack, isPlaying, currentTime, startedAt } = useRoomStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [localTime, setLocalTime] = useState(0);

  // Sincronizar áudio com estado do servidor
  useEffect(() => {
    if (!currentTrack?.preview_url) return;

    const audio = new Audio(currentTrack.preview_url);
    audioRef.current = audio;

    const updateTime = () => {
      if (audio) {
        setLocalTime(audio.currentTime * 1000);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", () => {
      // Quando terminar, o servidor já deve ter passado para a próxima
      setLocalTime(0);
    });

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.pause();
      audio.src = "";
    };
  }, [currentTrack?.id, currentTrack?.preview_url]);

  // Controlar reprodução
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.preview_url) return;

    if (isPlaying) {
      // Sincronizar tempo com servidor
      if (startedAt && currentTime > 0) {
        const serverTime = currentTime;
        const diff = Math.abs(audio.currentTime * 1000 - serverTime);
        if (diff > 500) {
          // Se diferença maior que 500ms, sincroniza
          audio.currentTime = serverTime / 1000;
        }
      }
      audio.play().catch((err) => {
        console.error("Erro ao reproduzir:", err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack?.id, currentTime, startedAt]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const duration = currentTrack?.duration_ms || 0;
  const progress = duration > 0 ? (localTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <Card className="border-[#2a2a2a] bg-[#1a1a1a] p-6">
        <div className="text-center text-gray-400">
          <p>Nenhuma música tocando</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a] p-6">
      <div className="flex items-center gap-4">
        {currentTrack.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentTrack.image_url}
            alt={currentTrack.album}
            className="size-20 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-lg bg-[#2a2a2a]">
            <span className="text-4xl">🎵</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="truncate text-lg font-semibold text-white">
            {currentTrack.name}
          </div>
          <div className="truncate text-sm text-gray-400">
            {currentTrack.artist}
          </div>
          <div className="mt-1 text-xs text-gray-500">{currentTrack.album}</div>

          {/* Barra de progresso */}
          <div className="mt-4 space-y-2">
            <div className="h-1 overflow-hidden rounded-full bg-[#2a2a2a]">
              <div
                className="h-full bg-[#1DB954] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(localTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!currentTrack.preview_url}
          className="size-16 rounded-full bg-[#1DB954] text-white hover:bg-[#1ed760] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPlaying ? (
            <Pause className="size-6" />
          ) : (
            <Play className="ml-1 size-6" />
          )}
        </Button>
      </div>

      {!currentTrack.preview_url && (
        <div className="mt-4 rounded border border-yellow-500/30 bg-yellow-900/20 p-3 text-center text-sm text-yellow-400">
          ⚠️ Preview não disponível para esta música
        </div>
      )}
    </Card>
  );
}
