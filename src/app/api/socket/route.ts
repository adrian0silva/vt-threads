import { Server as HTTPServer } from "http";
import { NextRequest } from "next/server";
import { Server as SocketIOServer } from "socket.io";

import { initializeSocket } from "@/lib/socket-server";

// Esta rota é apenas para inicializar o servidor Socket.IO
// O servidor real é criado no server.ts ou no handler customizado

export async function GET(req: NextRequest) {
  return new Response("Socket.IO Server", { status: 200 });
}

