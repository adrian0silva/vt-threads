import { NextRequest } from "next/server";

import { db } from "@/src/app/_lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  const category = await db.category.findFirst({
    where: { name: params.name },
    });
  const threads = await db.thread.findMany({
    where: { category_id: category?.id },
  });

  return Response.json({ threads }, { status: 200 });
}
