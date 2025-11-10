"use client";

import { Users as UsersIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRoomStore } from "@/store/room-store";

export function Users() {
  const { users, currentDJ } = useRoomStore();

  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center gap-2">
        <UsersIcon className="size-5 text-[#1DB954]" />
        <h3 className="font-semibold text-white">Usuários ({users.length})</h3>
      </div>

      {users.length === 0 ? (
        <div className="py-4 text-center text-gray-400">
          <p className="text-sm">Nenhum usuário conectado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const isDJ = user.socketId === currentDJ;
            return (
              <div
                key={user.socketId}
                className={`flex items-center gap-3 rounded-lg p-2 ${
                  isDJ
                    ? "border border-[#1DB954]/30 bg-[#1DB954]/20"
                    : "bg-[#121212]"
                }`}
              >
                <Avatar className="size-8">
                  <AvatarFallback className="bg-[#1DB954] text-xs text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    {user.name}
                    {isDJ && (
                      <span className="ml-2 text-xs text-[#1DB954]">🎧 DJ</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
