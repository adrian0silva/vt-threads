import crypto from "crypto";

import { db } from ".";
import { categoryTable, forumTable } from "./schema";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

// ✅ Corrigir os campos conforme o schema (title, slug, description)
const categories = [
  { title: "General Discussion" },
  { title: "Development" },
  { title: "Off Topic" },
];

const forums = [
  {
    title: "Welcome & Introductions",
    description: "Apresente-se à comunidade!",
    categoryTitle: "General Discussion",
  },
  {
    title: "JavaScript",
    description: "Tudo sobre JS moderno.",
    categoryTitle: "Development",
  },
  {
    title: "Random Chat",
    description: "Assuntos variados.",
    categoryTitle: "Off Topic",
  },
];

async function main() {
  console.log("🌱 Iniciando o seeding do banco de dados...");

  try {
    // Limpar dados existentes
    console.log("🧹 Limpando dados existentes...");
    await db.delete(forumTable);
    await db.delete(categoryTable);
    console.log("✅ Dados limpos com sucesso!");

    // Inserir categorias primeiro
    const categoryMap = new Map<string, string>();

    console.log("📂 Criando categorias...");
    for (const categoryData of categories) {
      const categoryId = crypto.randomUUID();
      const categorySlug = generateSlug(categoryData.title);

      console.log(`  📁 Criando categoria: ${categoryData.title}`);

      await db.insert(categoryTable).values({
        id: categoryId,
        title: categoryData.title,
        slug: categorySlug,
      });

      categoryMap.set(categoryData.title, categoryId);
    }

    // Inserir fóruns
    for (const forumData of forums) {
      const forumId = crypto.randomUUID();
      const forumSlug = generateSlug(forumData.title);
      const categoryId = categoryMap.get(forumData.categoryTitle);

      if (!categoryId) {
        throw new Error(`Categoria "${forumData.categoryTitle}" não encontrada`);
      }

      console.log(`📦 Criando fórum: ${forumData.title}`);

      await db.insert(forumTable).values({
        id: forumId,
        title: forumData.title,
        slug: forumSlug,
        description: forumData.description,
        categoryId,
      });
    }

    console.log("✅ Seeding concluído com sucesso!");
    console.log(
      `📊 Foram criadas ${categories.length} categorias, ${forums.length} fóruns.`,
    );
  } catch (error) {
    console.error("❌ Erro durante o seeding:", error);
    throw error;
  }
}

main().catch(console.error);
