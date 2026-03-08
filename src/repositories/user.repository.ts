import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTable } from "@/db/schema";

export async function updateAvatar(
  userId: string,
  imageUrl: string
): Promise<void> {
  await db
    .update(userTable)
    .set({ image: imageUrl })
    .where(eq(userTable.id, userId));
}
