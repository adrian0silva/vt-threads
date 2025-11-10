# Plug.dj Clone - Sistema de Salas de Música

Sistema de reprodução colaborativa de música em tempo real, similar ao Plug.dj.

## 🚀 Funcionalidades

- ✅ Buscar músicas no Spotify e adicionar à fila
- ✅ Reprodução automática da próxima música
- ✅ Sistema de DJ rotativo (cada usuário toca na sua vez)
- ✅ Chat em tempo real
- ✅ Lista de usuários conectados
- ✅ Sincronização de tempo entre todos os usuários
- ✅ Visual escuro estilo Spotify (#121212 e #1DB954)

## 📋 Pré-requisitos

1. **Credenciais do Spotify**:
   - Crie uma aplicação em [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Obtenha `SPOTIFY_CLIENT_ID` e `SPOTIFY_CLIENT_SECRET`
   - Adicione ao arquivo `.env`:

```env
SPOTIFY_CLIENT_ID=seu_client_id
SPOTIFY_CLIENT_SECRET=seu_client_secret
```

## 🛠️ Instalação e Execução

### Desenvolvimento

O projeto usa um servidor customizado para suportar Socket.IO:

```bash
# Instalar dependências (já instaladas)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Isso iniciará o servidor Next.js com Socket.IO na porta 3000.

### Produção

```bash
# Build
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── room/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Página da sala
│   │   └── page.tsx              # Lista de salas
│   └── api/
│       ├── socket/               # Rota Socket.IO
│       └── spotify/
│           ├── token/            # Obter token do Spotify
│           └── search/           # Buscar músicas
├── components/
│   └── room/
│       ├── search.tsx            # Componente de busca
│       ├── queue.tsx             # Componente de fila
│       ├── player.tsx            # Player de música
│       ├── chat.tsx              # Chat em tempo real
│       └── users.tsx             # Lista de usuários
├── hooks/
│   └── use-room.ts               # Hook para comunicação Socket.IO
├── lib/
│   └── socket-server.ts          # Servidor Socket.IO
└── store/
    └── room-store.ts             # Store Zustand para estado
```

## 🎮 Como Usar

1. **Acessar uma sala**:
   - Vá para `/room` para ver a lista de salas
   - Ou acesse diretamente `/room/test-room` (sala de teste)
   - Ou crie uma nova sala com qualquer ID: `/room/seu-id-aqui`

2. **Adicionar músicas**:
   - Use a barra de busca para encontrar músicas no Spotify
   - Clique em "Adicionar" ou use os botões de busca rápida (Eminem, Coldplay, etc.)
   - As músicas serão adicionadas à fila

3. **Sistema de DJ**:
   - O primeiro usuário que adiciona uma música se torna o DJ
   - Quando a música termina, passa automaticamente para o próximo usuário
   - Cada usuário toca na sua vez

4. **Chat**:
   - Digite mensagens no chat para conversar com outros usuários
   - As mensagens são sincronizadas em tempo real

## 🔧 Tecnologias Utilizadas

- **Next.js 15** (App Router)
- **Socket.IO** (comunicação em tempo real)
- **Zustand** (gerenciamento de estado)
- **TailwindCSS** (estilização)
- **Spotify Web API** (busca de músicas)
- **TypeScript** (tipagem)

## 📝 Notas Importantes

- **Preview URLs**: Nem todas as músicas do Spotify têm preview disponível. O sistema continua funcionando mesmo sem preview.
- **Persistência**: As salas são armazenadas em memória. Ao reiniciar o servidor, as salas são resetadas.
- **Limite de Preview**: Os previews do Spotify têm duração de 30 segundos.
- **Múltiplas Salas**: Cada sala (`/room/[id]`) é independente e isolada.

## 🐛 Troubleshooting

### Socket.IO não conecta

- Verifique se o servidor está rodando com `npm run dev` (não `npm run dev:next`)
- Verifique se a porta 3000 está disponível

### Erro ao buscar músicas

- Verifique se as credenciais do Spotify estão corretas no `.env`
- Verifique se a aplicação Spotify está ativa no dashboard

### Preview não toca

- Algumas músicas não têm preview disponível (isso é normal)
- Verifique o console do navegador para erros

## 🎨 Customização

O tema pode ser customizado editando as cores nos componentes:

- Fundo: `#121212`
- Verde Spotify: `#1DB954`
- Cards: `#1a1a1a`
- Bordas: `#2a2a2a`

## 📄 Licença

Este projeto é um clone educacional do Plug.dj.
