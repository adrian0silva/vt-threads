import { create } from "zustand";

import type { RoomState,Track, User } from "@/lib/socket-server";

export interface ChatMessage {
  id: string;
  message: string;
  userName: string;
  userId: string;
  timestamp: number;
}

interface RoomStore extends RoomState {
  chatMessages: ChatMessage[];
  setRoomState: (state: RoomState) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  roomId: "",
  currentTrack: null,
  queue: [],
  users: [],
  currentDJ: null,
  isPlaying: false,
  currentTime: 0,
  startedAt: null,
  chatMessages: [],
  setRoomState: (state) => set(state),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message].slice(-100), // Mantém apenas últimas 100 mensagens
    })),
  clearChat: () => set({ chatMessages: [] }),
}));

