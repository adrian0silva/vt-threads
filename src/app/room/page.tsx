"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function RoomListPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  const testRooms = [
    {
      id: "test-room",
      name: "Sala de Teste",
      description: "Sala global para testes",
    },
    { id: "lounge", name: "Lounge", description: "Música relaxante" },
    { id: "party", name: "Festa", description: "Música para festa" },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Music className="size-12 text-[#1DB954]" />
            <h1 className="text-4xl font-bold">Plug.dj Clone</h1>
          </div>
          <p className="text-lg text-gray-400">
            Reprodução colaborativa de música em tempo real
          </p>
        </div>

        <Card className="mb-8 border-[#2a2a2a] bg-[#1a1a1a] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Entrar em uma Sala
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                ID da Sala
              </label>
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                placeholder="Digite o ID da sala..."
                className="border-[#2a2a2a] bg-[#121212] text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Seu Nome (opcional)
              </label>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Seu nome..."
                className="border-[#2a2a2a] bg-[#121212] text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              onClick={handleJoinRoom}
              disabled={!roomId.trim()}
              className="w-full bg-[#1DB954] text-white hover:bg-[#1ed760]"
            >
              Entrar na Sala
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </Card>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">
            Salas Populares
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {testRooms.map((room) => (
              <Link key={room.id} href={`/room/${room.id}`}>
                <Card className="h-full cursor-pointer border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-colors hover:border-[#1DB954]">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {room.name}
                    </h3>
                    <Music className="size-5 text-[#1DB954]" />
                  </div>
                  <p className="mb-4 text-sm text-gray-400">
                    {room.description}
                  </p>
                  <div className="text-xs text-gray-500">ID: {room.id}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-[#1DB954]/30 bg-[#1DB954]/10 p-4">
          <h3 className="mb-2 font-semibold text-[#1DB954]">💡 Dica</h3>
          <p className="text-sm text-gray-300">
            Use a <strong>Sala de Teste</strong> para experimentar o sistema.
            Qualquer pessoa pode entrar e adicionar músicas à fila. O sistema
            funciona em tempo real com Socket.IO!
          </p>
        </div>
      </div>
    </div>
  );
}
