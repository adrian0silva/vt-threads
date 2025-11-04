// Funcoes de dados que podem ser chamadas diretamente no servidor
// Substitua com chamadas reais ao seu banco de dados

export type Forum = {
    id: string
    title: string
    slug: string
  }
  
  export type Thread = {
    id: string
    title: string
    slug: string
    description: string | null
    createdAt: string
    views: number
    postsCount: number
    userName?: string | null
    userAvatar?: string | null
    forumId?: string
  }
  
  const mockForums: Forum[] = [
    { id: "1", title: "Discordian Philosophy", slug: "discordian-philosophy" },
    { id: "2", title: "Chaos Magic", slug: "chaos-magic" },
    { id: "3", title: "Fnord Sightings", slug: "fnord-sightings" },
    { id: "4", title: "Sacred Chao", slug: "sacred-chao" },
    { id: "5", title: "Kallisti", slug: "kallisti" },
  ]
  
  const mockThreads: Thread[] = [
    {
      id: "thread-1",
      title: "The Law of Fives is Everywhere",
      slug: "law-of-fives-everywhere",
      description: "I keep seeing the number 5 in everything. Is this real or am I going mad?",
      createdAt: new Date("2024-01-15").toISOString(),
      views: 234,
      postsCount: 23,
      userName: "Pope Bob",
      userAvatar: null,
      forumId: "1",
    },
    {
      id: "thread-2",
      title: "How to Summon Eris",
      slug: "how-to-summon-eris",
      description: "A practical guide to invoking the Goddess of Chaos in your daily life.",
      createdAt: new Date("2024-01-14").toISOString(),
      views: 567,
      postsCount: 45,
      userName: "Malaclypse",
      userAvatar: null,
      forumId: "2",
    },
    {
      id: "thread-3",
      title: "Found a Fnord in My Cereal",
      slug: "fnord-in-cereal",
      description: "This morning I discovered a fnord hiding in my breakfast. What does it mean?",
      createdAt: new Date("2024-01-13").toISOString(),
      views: 123,
      postsCount: 12,
      userName: "Omar",
      userAvatar: null,
      forumId: "3",
    },
    {
      id: "thread-4",
      title: "The Sacred Chao Meditation",
      slug: "sacred-chao-meditation",
      description: "Share your experiences with Sacred Chao contemplation practices.",
      createdAt: new Date("2024-01-12").toISOString(),
      views: 345,
      postsCount: 34,
      userName: "Lady Mal",
      userAvatar: null,
      forumId: "4",
    },
    {
      id: "thread-5",
      title: "Kallisti: To the Prettiest One",
      slug: "kallisti-prettiest",
      description: "Discussing the original golden apple incident and its implications.",
      createdAt: new Date("2024-01-11").toISOString(),
      views: 456,
      postsCount: 56,
      userName: "Hagbard",
      userAvatar: null,
      forumId: "5",
    },
    {
      id: "thread-6",
      title: "Operation Mindfuck Success Stories",
      slug: "operation-mindfuck-stories",
      description: "Share your best pranks and reality hacks that spread chaos.",
      createdAt: new Date("2024-01-10").toISOString(),
      views: 789,
      postsCount: 67,
      userName: "Pope Bob",
      userAvatar: null,
      forumId: "1",
    },
    {
      id: "thread-7",
      title: "Sigil Crafting for Beginners",
      slug: "sigil-crafting-beginners",
      description: "Learn the basics of creating and charging sigils for chaos magic.",
      createdAt: new Date("2024-01-09").toISOString(),
      views: 890,
      postsCount: 78,
      userName: "Chaos Mage",
      userAvatar: null,
      forumId: "2",
    },
    {
      id: "thread-8",
      title: "Fnords in Modern Media",
      slug: "fnords-modern-media",
      description: "Spotting hidden fnords in movies, TV shows, and advertisements.",
      createdAt: new Date("2024-01-08").toISOString(),
      views: 234,
      postsCount: 23,
      userName: "Observer",
      userAvatar: null,
      forumId: "3",
    },
    {
      id: "thread-9",
      title: "The Pentabarf Explained",
      slug: "pentabarf-explained",
      description: "A deep dive into the five commandments of Discordianism.",
      createdAt: new Date("2024-01-07").toISOString(),
      views: 567,
      postsCount: 45,
      userName: "Malaclypse",
      userAvatar: null,
      forumId: "1",
    },
    {
      id: "thread-10",
      title: "Chaos Theory and Magic",
      slug: "chaos-theory-magic",
      description: "Exploring the connections between mathematical chaos and magical practice.",
      createdAt: new Date("2024-01-06").toISOString(),
      views: 678,
      postsCount: 56,
      userName: "Mathematician",
      userAvatar: null,
      forumId: "2",
    },
  ]
  
  export async function getForums(): Promise<Forum[]> {
    // Simula delay de banco de dados
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockForums
  }
  
  export async function getThreads(params?: { forumId?: string; cursor?: string }): Promise<{
    threads: Thread[]
    nextCursor: string | null
  }> {
    // Simula delay de banco de dados
    await new Promise((resolve) => setTimeout(resolve, 100))
  
    let filteredThreads = mockThreads
  
    // Filtra por forum se especificado
    if (params?.forumId) {
      filteredThreads = mockThreads.filter((thread) => thread.forumId === params.forumId)
    }
  
    // Paginacao simples baseada em cursor
    const pageSize = 5
    let startIndex = 0
  
    if (params?.cursor) {
      const cursorIndex = filteredThreads.findIndex((t) => t.id === params.cursor)
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1
      }
    }
  
    const paginatedThreads = filteredThreads.slice(startIndex, startIndex + pageSize)
    const nextCursor =
      startIndex + pageSize < filteredThreads.length ? paginatedThreads[paginatedThreads.length - 1].id : null
  
    return {
      threads: paginatedThreads,
      nextCursor,
    }
  }
  