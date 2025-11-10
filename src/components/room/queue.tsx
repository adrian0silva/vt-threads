"use client";

import { Music, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/store/room-store";
import type { Track } from "@/lib/socket-server";

interface QueueProps {
  onRemoveTrack: (trackId: string) => void;
}

export function Queue({ onRemoveTrack }: QueueProps) {
  const { queue, currentTrack } = useRoomStore();

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a] p-4">
      <h3 className="mb-4 font-semibold text-white">Fila de Reprodução</h3>

      {currentTrack && (
        <div className="mb-4 border-b border-[#2a2a2a] pb-4">
          <div className="mb-2 text-xs text-gray-400">TOCANDO AGORA</div>
          <div className="flex items-center gap-3 rounded-lg border border-[#1DB954]/30 bg-[#1DB954]/10 p-3">
            {currentTrack.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentTrack.image_url}
                alt={currentTrack.album}
                className="size-12 rounded object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded bg-[#2a2a2a]">
                <Music className="size-6 text-gray-500" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-white">
                {currentTrack.name}
              </div>
              <div className="truncate text-sm text-gray-300">
                {currentTrack.artist}
              </div>
              <div className="mt-1 text-xs text-[#1DB954]">
                {formatDuration(currentTrack.duration_ms)}
              </div>
            </div>
          </div>
        </div>
      )}

      {queue.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <Music className="mx-auto mb-2 size-12 opacity-50" />
          <p>Nenhuma música na fila</p>
        </div>
      ) : (
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {queue.map((track, index) => (
            <div
              key={`${track.id}-${index}`}
              className="group flex items-center gap-3 rounded-lg bg-[#121212] p-3 transition-colors hover:bg-[#2a2a2a]"
            >
              <div className="w-6 text-center text-sm text-gray-400">
                {index + 1}
              </div>
              {track.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.image_url}
                  alt={track.album}
                  className="size-10 rounded object-cover"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded bg-[#2a2a2a]">
                  <Music className="size-5 text-gray-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">
                  {track.name}
                </div>
                <div className="truncate text-xs text-gray-400">
                  {track.artist}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {formatDuration(track.duration_ms)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveTrack(track.id)}
                className="size-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
