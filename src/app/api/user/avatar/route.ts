import type { NextRequest } from "next/server";

import * as userRepo from "@/repositories/user.repository";

export async function POST(req: NextRequest) {
  try {
    const { image, userId } = await req.json();

    if (!image || !userId) {
      return Response.json(
        { error: "Parâmetros faltando" },
        { status: 400 }
      );
    }

    await userRepo.updateAvatar(userId, image);

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Falha ao atualizar avatar" },
      { status: 500 }
    );
  }
}
