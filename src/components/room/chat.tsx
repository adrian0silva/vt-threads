"use client";

import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRoomStore } from "@/store/room-store";

interface ChatProps {
  onSendMessage: (message: string) => void;
  userName?: string;
}

export function Chat({ onSendMessage, userName }: ChatProps) {
  const { chatMessages } = useRoomStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="flex h-full flex-col border-[#2a2a2a] bg-[#1a1a1a]">
      <div className="border-b border-[#2a2a2a] p-4">
        <h3 className="font-semibold text-white">Chat</h3>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {chatMessages.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <p>Nenhuma mensagem ainda</p>
            <p className="mt-2 text-sm">Seja o primeiro a falar!</p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-[#1DB954]">
                  {msg.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div className="text-sm break-words text-gray-300">
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#2a2a2a] p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite uma mensagem..."
            className="border-[#2a2a2a] bg-[#121212] text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-[#1DB954] text-white hover:bg-[#1ed760]"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
