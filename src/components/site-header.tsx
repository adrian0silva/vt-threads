"use client"

import { LogOutIcon, Search, SettingsIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

import { LoginDialog } from "./login-dialog"
import { RegisterDialog } from "./register-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { SidebarTrigger } from "./ui/sidebar"

export function SiteHeader() {
  const { data: session } = authClient.useSession()
  const router = useRouter() // Added router for navigation

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />

      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        <Link href="/" className="font-semibold">
          <Image src="/vtboards.png" alt="" width={64} height={64} className="rounded bg-inherit" />
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="w-full pl-9" aria-label="Search" />
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1">
          {session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={(session?.user?.image as string | undefined) || "/placeholder.svg"}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.split(" ")?.[0]?.[0]}
                      {session?.user?.name?.split(" ")?.[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => console.log("Perfil")}>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={(session?.user?.image as string | undefined) || "/placeholder.svg"}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.split(" ")?.[0]?.[0]}
                        {session?.user?.name?.split(" ")?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {session?.user?.name}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => authClient.signOut()}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <LoginDialog />
              <RegisterDialog />
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
