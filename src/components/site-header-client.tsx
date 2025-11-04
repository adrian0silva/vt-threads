"use client";

import {
  Bell,
  ChevronDown,
  LogOutIcon,
  Search,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { LoginDialog } from "./login-dialog";
import { RegisterDialog } from "./register-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeaderClient({ user }: { user?: any }) {
  console.log("user");

  console.log(user);
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Link href="/" className="font-semibold">
          Logo
        </Link>

        <div className="mx-auto hidden max-w-xl flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search…"
              className="w-full pl-9"
              aria-label="Search"
            />
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.image as string | undefined}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                      {user?.name?.split(" ")?.[0]?.[0]}
                      {user?.name?.split(" ")?.[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => console.log("Configurações")}
                  >
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.image as string | undefined}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>
                        {user?.name?.split(" ")?.[0]?.[0]}
                        {user?.name?.split(" ")?.[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user?.name}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => console.log("Configurações")}
                  >
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
  );
}
