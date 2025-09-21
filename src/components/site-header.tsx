"use client";

import { LogOutIcon, Search, SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { LoginDialog } from "./login-dialog";
import { RegisterDialog } from "./register-dialog";
import { ThemeSwitcher } from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader() {
  const { data: session } = authClient.useSession();
  const router = useRouter(); // Added router for navigation

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        {/* Trigger + Logo sempre colados */}
        <div className="flex flex-none items-center gap-2">
          <SidebarTrigger />
          <Link href="/" className="flex-none">
            <div className="flex items-center gap-2">
              <Image
                src="/erislogo.png"
                alt="Logo"
                width={64}
                height={64}
                className="rounded bg-inherit"
              />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-bold text-transparent"></span>
            </div>
          </Link>
        </div>
        <div className="mx-auto hidden max-w-xl flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-purple-500" />
            <Input
              placeholder="🔍 Search Chaos..."
              className="w-full border-purple-200 pl-9 focus:border-purple-400"
              aria-label="Search"
            />
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <ThemeSwitcher />
          {session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        (session?.user?.image as string | undefined) ||
                        "/placeholder.svg"
                      }
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
                    <div className="flex items-center gap-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={
                            (session?.user?.image as string | undefined) ||
                            "/placeholder.svg"
                          }
                          alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{session?.user?.name}</div>
                        <div className="text-xs text-purple-600">
                          👑 Erisian User
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    ⚙️ Chaos Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => authClient.signOut()}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    🚪 Exit Chaos
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
  );
}
