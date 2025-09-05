import { redirect } from "next/navigation"

import { AvatarSettings } from "@/components/avatar-settings"
import { auth } from "@/lib/auth"

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  })

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas configurações de conta e preferências.</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Avatar</h2>
          <AvatarSettings user={session.user} />
        </div>
      </div>
    </div>
  )
}
