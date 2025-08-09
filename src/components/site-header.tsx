"use client"

import { Bell, ChevronDown, Search } from 'lucide-react'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { LoginDialog } from "./login-dialog"
import { RegisterDialog } from "./register-dialog"
import { SidebarTrigger } from './ui/sidebar'

export function SiteHeader() {
    return (
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarTrigger className="-ml-1" />
          <Link href="/" className="font-semibold">
            Logo
          </Link>
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">

  
          <div className="mx-auto hidden max-w-xl flex-1 items-center md:flex">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search…"
                className="w-full pl-9"
                aria-label="Search"
              />
            </div>
          </div>
  
          <nav className="ml-auto flex items-center gap-1">
            <LoginDialog />
            <RegisterDialog />
          </nav>
        </div>
      </header>
    )
  }