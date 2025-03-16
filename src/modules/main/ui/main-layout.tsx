"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

import type { auth } from "~/shared/lib/auth/server";
import { Modals } from "~/app/_modals";
import { ModalStoreProvider } from "~/app/_providers";
import { PlayerStoreProvider } from "~/app/_providers/player-store-provider";
import { SidebarProvider } from "~/shared/ui/sidebar";
import { MainGuide } from "./guide";
import { MainNavBar } from "./nav-bar";
import { Player } from "./player";

interface MainLayoutProps extends PropsWithChildren {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  defaultOpen?: boolean;
}

export function MainLayout({
  children,
  defaultOpen = false,
  session,
}: MainLayoutProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ModalStoreProvider>
      <PlayerStoreProvider>
        <SidebarProvider
          defaultOpen={defaultOpen}
          data-content-scrolled={hasScrolled}
          style={
            {
              "--nav-bar-height": "4rem",
              "--content-max-width": "1920px",
              "--content-spacing": "calc(var(--spacing) * 8)",
            } as React.CSSProperties
          }
        >
          <MainNavBar session={session} />
          <MainGuide />
          <MainLayoutContent>{children}</MainLayoutContent>
          <Player />
        </SidebarProvider>
        <Modals />
      </PlayerStoreProvider>
    </ModalStoreProvider>
  );
}

function MainLayoutContent({ children }: PropsWithChildren) {
  return (
    <main data-slot="content" className="relative flex-1">
      <div className="size-full pt-(--nav-bar-height)">{children}</div>
    </main>
  );
}
