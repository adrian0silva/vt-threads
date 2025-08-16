import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { userTable } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { image, userId } = await req.json();

    if (!image || !userId) {
      return NextResponse.json({ error: "Parâmetros faltando" }, { status: 400 });
    }

    await db.update(userTable)
      .set({ image: image })
      .where(eq(userTable.id, userId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Falha ao atualizar avatar" }, { status: 500 });
  }
}