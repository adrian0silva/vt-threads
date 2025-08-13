"use client"

import { BookOpen, Flame, Gamepad2, Home, MessageSquare, MessageSquareText, Newspaper, Settings, Ticket } from 'lucide-react'

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
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Forums", icon: Home, url: "#" },
  { title: "Gaming Forum", icon: Gamepad2, url: "/forums/gaming" },
  { title: "Gaming Hangouts", icon: MessageSquare, url: "#" },
  { title: "Vale Tudo", icon: MessageSquareText, url: "/forums/vale-tudo" },
  { title: "Etcetera Hangouts", icon: BookOpen, url: "#" },
  { title: "Gaming Headlines", icon: Newspaper, url: "#" },
  { title: "Trending Threads", icon: Flame, url: "#" },
  { title: "Latest Threads", icon: Newspaper, url: "#" },
  { title: "Tickets", icon: Ticket, url: "#" },
]

export function EraSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                <Settings />
                <span>Light/Dark</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <Ticket />
                <span>Hide Images</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
