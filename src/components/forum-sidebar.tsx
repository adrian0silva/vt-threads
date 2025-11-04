"use client";

import {
  Apple,
  BookOpen,
  Crown,
  Flame,
  Gamepad2,
  Home,
  MessageSquare,
  MessageSquareText,
  Newspaper,
  Settings,
  Sparkles,
  Ticket,
  TvIcon,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Início", icon: Home, url: "/" },
  { title: "Fóruns", icon: TvIcon, url: "/forums" },
  { title: "Gaming", icon: Gamepad2, url: "/forums/jogos-em-geral" },
  {
    title: "Vale Tudo",
    icon: MessageSquareText,
    url: "/forums/vale-tudo",
  },
  { title: "Em Alta", icon: Flame, url: "#" },
  { title: "Notícias", icon: Newspaper, url: "#" },
];

export function ForumSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Sparkles />
                <span>Modo Escuro</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Settings />
                <span>Configurações</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
