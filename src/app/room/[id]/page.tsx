"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRoom } from "@/hooks/use-room";
import { Search } from "@/components/room/search";
import { Queue } from "@/components/room/queue";
import { Player } from "@/components/room/player";
import { Chat } from "@/components/room/chat";
import { Users } from "@/components/room/users";
import type { Track } from "@/lib/socket-server";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [userName, setUserName] = useState("");

  const { addTrack, removeTrack, play, pause, sendChatMessage } = useRoom(
    roomId,
    userName,
  );

  useEffect(() => {
    // Gerar nome aleatório se não tiver
    if (!userName) {
      const savedName = localStorage.getItem("room-user-name");
      if (savedName) {
        setUserName(savedName);
      } else {
        const randomName = `Usuário ${Math.floor(Math.random() * 1000)}`;
        setUserName(randomName);
        localStorage.setItem("room-user-name", randomName);
      }
    } else {
      localStorage.setItem("room-user-name", userName);
    }
  }, [userName]);

  const handleAddTrack = (track: Track) => {
    addTrack(track);
  };

  const handleRemoveTrack = (trackId: string) => {
    removeTrack(trackId);
  };

  const handleSendMessage = (message: string) => {
    sendChatMessage(message, userName);
  };

  return (
    <div className="fixed inset-0 min-h-screen overflow-auto bg-[#121212] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-white">
            Sala: <span className="text-[#1DB954]">{roomId}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Clone do Plug.dj - Reprodução colaborativa de música
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Coluna Esquerda - Player e Busca */}
          <div className="space-y-6 lg:col-span-2">
            {/* Player */}
            <Player onPlay={play} onPause={pause} />

            {/* Busca */}
            <Search onAddTrack={handleAddTrack} />

            {/* Fila */}
            <Queue onRemoveTrack={handleRemoveTrack} />
          </div>

          {/* Coluna Direita - Chat e Usuários */}
          <div className="space-y-6">
            {/* Usuários */}
            <Users />

            {/* Chat */}
            <div className="h-[500px]">
              <Chat onSendMessage={handleSendMessage} userName={userName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
