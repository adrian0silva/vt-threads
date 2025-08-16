// site-header-server.tsx
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import {SiteHeaderClient} from "./site-header-client";

export default async function SiteHeaderServer() {
const session = await auth.api.getSession({
    headers: await headers()
}) // pega sessão no servidor
  return <SiteHeaderClient user={session?.user} />;
}
