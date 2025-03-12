"use client";

import Link from "next/link";
import { HomeIcon, LibraryIcon, PlusIcon, SearchIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/shared/ui/sidebar";

export function MainGuide() {
  return (
    <Sidebar className="z-4" collapsible="icon">
      <SidebarContent className="z-4">
        <MainGuideSection />
        <SidebarSeparator />
        <MainGuidePlaylistsSection />
      </SidebarContent>
    </Sidebar>
  );
}

function MainGuideSection() {
  const items = [
    {
      title: "Home",
      icon: HomeIcon,
      href: "/",
    },
    {
      title: "Explore",
      icon: SearchIcon,
      href: "/explore",
    },
    {
      title: "Library",
      icon: LibraryIcon,
      href: "/library",
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={false}>
                <Link href={item.href} className="gap-4">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function MainGuidePlaylistsSection() {
  // TODO: Fetch playlists, and logic for adding new playlist

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={false}
              className="bg-sidebar-accent/50 gap-4 rounded-full"
            >
              <PlusIcon />
              <span>New playlist</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
