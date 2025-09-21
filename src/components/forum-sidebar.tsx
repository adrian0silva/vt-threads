"use client";

import {
  BookOpen,
  Flame,
  Gamepad2,
  Home,
  MessageSquare,
  MessageSquareText,
  Newspaper,
  Settings,
  Ticket,
  Apple,
  Zap,
  Crown,
  Sparkles,
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
  { title: "🌪️ Chaos Forums", icon: Home, url: "#" },
  { title: "🍎 Gaming Chaos", icon: Gamepad2, url: "/forums/jogos-em-geral" },
  {
    title: "⚡ Vale Tudo Chaos",
    icon: MessageSquareText,
    url: "/forums/vale-tudo",
  },
  { title: "🔥 Trending Chaos", icon: Flame, url: "#" },
  { title: "📰 Latest Erisian News", icon: Newspaper, url: "#" },
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
                <span>🌈 Chaos/Dark Mode</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Apple />
                <span>🍎 Hide Sacred Images</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
