import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cookieStore = await cookies();

  let guestId = cookieStore.get("guestId")?.value;
  const userId = session?.user?.id;

  const ttl = 300; // 5 minutos

  // ✅ SE ESTÁ LOGADO
  if (userId) {
    // 🧹 remove presença de visitante antiga
    if (guestId) {
      await redis.del(`online:guest:${guestId}`);
      cookieStore.delete("guestId");
    }

    await redis.set(`online:user:${userId}`, 1, { ex: ttl });
    return NextResponse.json({ ok: true });
  }

  // ✅ SE É VISITANTE
  if (!guestId) {
    guestId = randomUUID();
    cookieStore.set("guestId", guestId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  await redis.set(`online:guest:${guestId}`, 1, { ex: ttl });

  return NextResponse.json({ ok: true });
}
