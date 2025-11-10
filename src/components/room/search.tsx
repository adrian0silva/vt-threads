"use client";

import { Music, Search as SearchIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Track } from "@/lib/socket-server";

interface SearchProps {
  onAddTrack: (track: Track) => void;
}

export function Search({ onAddTrack }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(query)}&limit=10`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar músicas");
      }

      setResults(data.tracks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery);
    // Auto-search após definir a query
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleAddTrack = (track: Track) => {
    onAddTrack(track);
    setQuery("");
    setResults([]);
  };

  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a] p-4">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Buscar músicas no Spotify..."
              className="border-[#2a2a2a] bg-[#121212] pl-10 text-white placeholder:text-gray-500"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        {/* Botões de busca rápida */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickSearch("Eminem")}
            className="border-[#2a2a2a] bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Eminem
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickSearch("Coldplay")}
            className="border-[#2a2a2a] bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Coldplay
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickSearch("The Weeknd")}
            className="border-[#2a2a2a] bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]"
          >
            The Weeknd
          </Button>
        </div>

        {error && (
          <div className="rounded bg-red-900/20 p-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {results.map((track) => (
              <div
                key={track.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#121212] p-3 transition-colors hover:bg-[#2a2a2a]"
                onClick={() => handleAddTrack(track)}
              >
                {track.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={track.image_url}
                    alt={track.album}
                    className="size-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded bg-[#2a2a2a]">
                    <Music className="size-6 text-gray-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-white">
                    {track.name}
                  </div>
                  <div className="truncate text-sm text-gray-400">
                    {track.artist}
                  </div>
                  {!track.preview_url && (
                    <div className="mt-1 text-xs text-yellow-400">
                      ⚠️ Preview não disponível
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTrack(track);
                  }}
                  className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
                >
                  Adicionar
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
