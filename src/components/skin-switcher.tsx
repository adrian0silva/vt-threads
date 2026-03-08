"use client";

import { BookMarked, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSkin } from "./skin-provider";

export function SkinSwitcher() {
  const { skin, setSkin } = useSkin();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Tema visual">
          {skin === "principia" ? (
            <BookMarked className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <LayoutGrid className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Trocar tema visual</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setSkin("default")}
          className={skin === "default" ? "bg-accent text-accent-foreground" : ""}
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          Fórum normal
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setSkin("principia")}
          className={skin === "principia" ? "bg-accent text-accent-foreground" : ""}
        >
          <BookMarked className="mr-2 h-4 w-4" />
          Principia Discordia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
