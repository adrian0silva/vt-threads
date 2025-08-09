import crypto from "crypto";

import { db } from ".";
import { forumTable, postTable, threadTable, userTable } from "./schema";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

async function main() {
  console.log("🌱 Iniciando seed...");

  try {
    // Limpar tabelas na ordem correta (dependências primeiro)
    console.log("🧹 Limpando tabelas...");
    await db.delete(postTable);
    await db.delete(threadTable);
    await db.delete(forumTable);
    await db.delete(userTable);

    console.log("✅ Tabelas limpas");

    // Criar usuários de exemplo
    console.log("👤 Criando usuários...");
    const users = [
      { id: "u1", name: "Alice", email: "alice@example.com" },
      { id: "u2", name: "Bob", email: "bob@example.com" },
    ];

    for (const user of users) {
      await db.insert(userTable).values({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: false,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Criar fóruns
    console.log("📂 Criando fóruns...");
    const forums: {
      id: string;
      category: "GAMING" | "POLITICA" | "VALE_TUDO";
      title: string;
      slug: string;
      description: string;
    }[] = [
      {
        id: crypto.randomUUID(),
        category: "GAMING",
        title: "Jogos em Geral",
        slug: generateSlug("Jogos em Geral"),
        description: "Discussões sobre games de todos os tipos",
      },
      {
        id: crypto.randomUUID(),
        category: "POLITICA",
        title: "Debates Políticos",
        slug: generateSlug("Debates Políticos"),
        description: "Discussões sobre política nacional e internacional",
      },
    ];

    for (const forum of forums) {
      await db.insert(forumTable).values({
        ...forum,
        createdAt: new Date(),
      });
    }

    // Criar threads
    console.log("🧵 Criando threads...");
    const threads = [
      {
        id: crypto.randomUUID(),
        title: "Seu jogo favorito",
        description: "Qual jogo você mais gosta e por quê?",
        forumId: forums[0].id,
        userId: "u1",
      },
      {
        id: crypto.randomUUID(),
        title: "Últimas eleições",
        description: "O que achou do resultado das últimas eleições?",
        forumId: forums[1].id,
        userId: "u2",
      },
    ];

    for (const thread of threads) {
      await db.insert(threadTable).values({
        ...thread,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Criar posts
    console.log("💬 Criando posts...");
    const posts = [
      {
        id: crypto.randomUUID(),
        content: "Eu gosto muito de The Witcher 3, pela história e ambientação.",
        threadId: threads[0].id,
        userId: "u1",
      },
      {
        id: crypto.randomUUID(),
        content: "Meu favorito é Hollow Knight. Ótima trilha sonora!",
        threadId: threads[0].id,
        userId: "u2",
      },
      {
        id: crypto.randomUUID(),
        content: "Acho que o resultado foi surpreendente, não esperava.",
        threadId: threads[1].id,
        userId: "u2",
      },
    ];

    for (const post of posts) {
      await db.insert(postTable).values({
        ...post,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log("✅ Seed concluído com sucesso!");
  } catch (err) {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  }
}

main();
