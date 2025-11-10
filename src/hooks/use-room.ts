"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import type { Track } from "@/lib/socket-server";
import { type ChatMessage,useRoomStore } from "@/store/room-store";

export function useRoom(roomId: string, userName?: string) {
  const socketRef = useRef<Socket | null>(null);
  const { setRoomState, addChatMessage } = useRoomStore();

  useEffect(() => {
    if (!roomId) return;

    // Conectar ao Socket.IO
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // Event listeners
    socket.on("connect", () => {
      const socketId = socket.id;
      console.log("Conectado ao Socket.IO:", socketId);
      // Entrar na sala
      socket.emit("room:join", {
        roomId,
        userName: userName || `Usuário ${socketId ? socketId.slice(0, 6) : "Anônimo"}`,
      });
    });

    socket.on("room:state", (state) => {
      setRoomState(state);
    });

    socket.on("room:chat-message", (message: ChatMessage) => {
      addChatMessage(message);
    });

    socket.on("room:user-joined", (user) => {
      console.log("Usuário entrou:", user);
    });

    socket.on("room:user-left", (data) => {
      console.log("Usuário saiu:", data);
    });

    socket.on("disconnect", () => {
      console.log("Desconectado do Socket.IO");
    });

    // Sincronizar tempo periodicamente
    const syncInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("room:sync-time", { roomId });
      }
    }, 5000); // Sincroniza a cada 5 segundos

    // Cleanup
    return () => {
      clearInterval(syncInterval);
      if (socket.connected) {
        socket.emit("room:leave", { roomId });
        socket.disconnect();
      }
    };
  }, [roomId, userName, setRoomState, addChatMessage]);

  const addTrack = (track: Track) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("room:add-track", { roomId, track });
    }
  };

  const removeTrack = (trackId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("room:remove-track", { roomId, trackId });
    }
  };

  const play = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("room:play", { roomId });
    }
  };

  const pause = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("room:pause", { roomId });
    }
  };

  const sendChatMessage = (message: string, userName?: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("room:chat", {
        roomId,
        message,
        userName: userName || "Anônimo",
      });
    }
  };

  return {
    addTrack,
    removeTrack,
    play,
    pause,
    sendChatMessage,
    socket: socketRef.current,
  };
}

