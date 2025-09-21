import {
  Apple,
  Crown,
  FileText,
  GamepadIcon,
  Home,
  LineChartIcon,
  MessageSquareIcon,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Dados do menu
const menuItems = [
  {
    title: "🌪️ Chaos Forums",
    url: "/",
    icon: Home,
  },
  {
    title: "⚡ Vale Tudo Chaos",
    url: "/forums/vale-tudo",
    icon: MessageSquareIcon,
  },
  {
    title: "🍎 Gaming Chaos",
    url: "/forums/jogos-em-geral",
    icon: GamepadIcon,
  },
  {
    title: "📰 Latest Erisian Topics",
    url: "/ultimos-topicos",
    icon: FileText,
  },
  {
    title: "🔥 Trending Chaos",
    url: "/em-alta",
    icon: LineChartIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Apple className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">🌪️ Chaos Forum</span>
                  <span className="truncate text-xs text-purple-600">
                    Principia Discordia
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel> </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
            <SidebarMenuButton>
              <Crown />
              <span>👑 Erisian User</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
