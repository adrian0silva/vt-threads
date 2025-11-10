import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Tipos para a sala
export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  preview_url: string | null;
  image_url: string | null;
  duration_ms: number;
  addedBy: string;
  addedAt: number;
}

export interface User {
  id: string;
  name: string;
  socketId: string;
  joinedAt: number;
}

export interface RoomState {
  roomId: string;
  currentTrack: Track | null;
  queue: Track[];
  users: User[];
  currentDJ: string | null; // socketId do DJ atual
  isPlaying: boolean;
  currentTime: number;
  startedAt: number | null;
}

// Armazenamento em memória das salas
const rooms = new Map<string, RoomState>();

// Função para obter ou criar uma sala
function getOrCreateRoom(roomId: string): RoomState {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomId,
      currentTrack: null,
      queue: [],
      users: [],
      currentDJ: null,
      isPlaying: false,
      currentTime: 0,
      startedAt: null,
    });
  }
  return rooms.get(roomId)!;
}

// Função para obter próximo DJ da fila
function getNextDJ(room: RoomState): string | null {
  if (room.queue.length === 0) return null;
  
  // Se não há DJ atual, pega o primeiro da fila
  if (!room.currentDJ) {
    const firstTrack = room.queue[0];
    const user = room.users.find(u => u.id === firstTrack.addedBy);
    return user?.socketId || null;
  }

  // Encontra o DJ atual na lista de usuários
  const currentDJIndex = room.users.findIndex(u => u.socketId === room.currentDJ);
  if (currentDJIndex === -1) {
    // DJ atual não existe mais, pega o primeiro
    const firstTrack = room.queue[0];
    const user = room.users.find(u => u.id === firstTrack.addedBy);
    return user?.socketId || null;
  }

  // Pega o próximo usuário na lista
  const nextIndex = (currentDJIndex + 1) % room.users.length;
  return room.users[nextIndex]?.socketId || null;
}

// Variável global para armazenar a instância do io
let globalIO: SocketIOServer | null = null;

// Função para tocar próxima música
function playNextTrack(room: RoomState) {
  if (!globalIO) return;
  
  if (room.queue.length === 0) {
    room.currentTrack = null;
    room.isPlaying = false;
    room.currentDJ = null;
    room.currentTime = 0;
    room.startedAt = null;
    globalIO.to(room.roomId).emit("room:state", room);
    return;
  }

  const nextTrack = room.queue.shift()!;
  room.currentTrack = nextTrack;
  room.isPlaying = true;
  room.currentTime = 0;
  room.startedAt = Date.now();
  room.currentDJ = getNextDJ(room);

  globalIO.to(room.roomId).emit("room:state", room);
}

// Função para sincronizar tempo
function syncTime(room: RoomState) {
  if (!room.isPlaying || !room.startedAt || !room.currentTrack) {
    return;
  }

  const elapsed = Date.now() - room.startedAt;
  const duration = room.currentTrack.duration_ms;

  if (elapsed >= duration) {
    // Música terminou, tocar próxima
    playNextTrack(room);
  } else {
    room.currentTime = elapsed;
  }
}

// Inicializar sincronização de tempo
setInterval(() => {
  rooms.forEach((room) => {
    syncTime(room);
  });
}, 1000); // Atualiza a cada segundo

export function initializeSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  globalIO = io;

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Entrar na sala
    socket.on("room:join", (data: { roomId: string; userName: string }) => {
      const { roomId, userName } = data;
      socket.join(roomId);

      const room = getOrCreateRoom(roomId);
      const user: User = {
        id: socket.id,
        name: userName || `Usuário ${socket.id.slice(0, 6)}`,
        socketId: socket.id,
        joinedAt: Date.now(),
      };

      // Remove usuário se já existir (reconexão)
      room.users = room.users.filter((u) => u.socketId !== socket.id);
      room.users.push(user);

      // Se não há DJ e há músicas na fila, define o primeiro como DJ
      if (!room.currentDJ && room.queue.length > 0) {
        room.currentDJ = getNextDJ(room);
      }

      // Envia estado atual da sala
      socket.emit("room:state", room);
      // Notifica outros usuários
      socket.to(roomId).emit("room:user-joined", user);
    });

    // Adicionar música à fila
    socket.on("room:add-track", (data: { roomId: string; track: Track }) => {
      const { roomId, track } = data;
      const room = getOrCreateRoom(roomId);

      // Adiciona informações do usuário que adicionou
      const user = room.users.find((u) => u.socketId === socket.id);
      track.addedBy = user?.id || socket.id;
      track.addedAt = Date.now();

      room.queue.push(track);

      // Se não há música tocando e não há DJ, começa a tocar
      if (!room.currentTrack && !room.isPlaying) {
        playNextTrack(room);
      } else if (!room.currentDJ) {
        room.currentDJ = getNextDJ(room);
      }

      io.to(roomId).emit("room:state", room);
    });

    // Remover música da fila
    socket.on("room:remove-track", (data: { roomId: string; trackId: string }) => {
      const { roomId, trackId } = data;
      const room = getOrCreateRoom(roomId);

      room.queue = room.queue.filter((t) => t.id !== trackId);
      io.to(roomId).emit("room:state", room);
    });

    // Controles de reprodução
    socket.on("room:play", (data: { roomId: string }) => {
      const { roomId } = data;
      const room = getOrCreateRoom(roomId);

      if (room.currentTrack) {
        room.isPlaying = true;
        if (!room.startedAt) {
          room.startedAt = Date.now() - room.currentTime;
        } else {
          room.startedAt = Date.now() - room.currentTime;
        }
        io.to(roomId).emit("room:state", room);
      }
    });

    socket.on("room:pause", (data: { roomId: string }) => {
      const { roomId } = data;
      const room = getOrCreateRoom(roomId);

      if (room.currentTrack) {
        room.isPlaying = false;
        syncTime(room);
        io.to(roomId).emit("room:state", room);
      }
    });

    // Enviar mensagem no chat
    socket.on("room:chat", (data: { roomId: string; message: string; userName: string }) => {
      const { roomId, message, userName } = data;
      const room = getOrCreateRoom(roomId);
      const user = room.users.find((u) => u.socketId === socket.id);
      const name = user?.name || userName || "Anônimo";

      io.to(roomId).emit("room:chat-message", {
        id: Date.now().toString(),
        message,
        userName: name,
        userId: socket.id,
        timestamp: Date.now(),
      });
    });

    // Sincronizar tempo
    socket.on("room:sync-time", (data: { roomId: string }) => {
      const { roomId } = data;
      const room = getOrCreateRoom(roomId);
      socket.emit("room:state", room);
    });

    // Desconectar
    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);

      // Remove usuário de todas as salas
      rooms.forEach((room) => {
        const userIndex = room.users.findIndex((u) => u.socketId === socket.id);
        if (userIndex !== -1) {
          room.users.splice(userIndex, 1);

          // Se era o DJ atual, passa para o próximo
          if (room.currentDJ === socket.id) {
            playNextTrack(room);
          }

          io.to(room.roomId).emit("room:user-left", { socketId: socket.id });
          io.to(room.roomId).emit("room:state", room);
        }
      });
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return globalIO;
}
