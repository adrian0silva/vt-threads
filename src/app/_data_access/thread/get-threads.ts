import "server-only"

import { db } from "@/src/app/_lib/prisma";
import { Thread } from "@/src/app/generated/prisma";
import { unstable_noStore } from "next/cache";

export const getThreads = async (forum: string): Promise<Thread[]> => {
    const category = await db.category.findFirst({where: { name: forum }});

    return db.thread.findMany({where: { category_id: category?.id },
         orderBy: { updated_at: "desc" }});
}