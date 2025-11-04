"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ThemeSwitcher } from "./theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);

  // Simular sessao - substitua com authClient.useSession() quando disponivel
  const session = null; // ou use: const { data: session } = authClient.useSession()

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        {/* Logo */}
        <div className="flex flex-none items-center gap-2">
          <Link href="/" className="flex-none">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-bold text-transparent">
                VT Forums
              </span>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="mx-auto hidden max-w-xl flex-1 items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-purple-500" />
            <Input
              placeholder="Search..."
              className="w-full border-purple-200 pl-9 focus:border-purple-400"
              aria-label="Search"
            />
          </div>
        </div>

        <nav
          className="ml-auto flex items-center gap-1"
          suppressHydrationWarning
        >
          <ThemeSwitcher />
          {mounted ? (
            <>
              {session?.user ? (
                <>
                  {/* User menu - adicione Avatar e DropdownMenu aqui quando disponivel */}
                  <Button variant="ghost" size="sm">
                    Perfil
                  </Button>
                  <Button variant="ghost" size="sm">
                    Sair
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  {/* LoginDialog e RegisterDialog - substitua quando disponivel */}
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                  <Button variant="default" size="sm">
                    Registrar
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1">
              <div className="h-9 w-16" />
              <div className="h-9 w-20" />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
