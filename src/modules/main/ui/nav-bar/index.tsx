"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOutIcon, UserIcon } from "lucide-react";

import { auth, User } from "~/shared/lib/auth/server";
import { cn } from "~/shared/lib/utils";
import { buttonVariants } from "~/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/shared/ui/dropdown-menu";
import { SidebarTrigger } from "~/shared/ui/sidebar";

export function MainNavBar({
  session,
}: {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
}) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "bg-sidebar fixed top-0 right-0 left-0 z-5 h-(--nav-bar-height) border-b opacity-0 transition-opacity duration-200 ease-linear will-change-[opacity] group-data-[content-scrolled=true]/sidebar-wrapper:opacity-100",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "bg-sidebar pointer-events-none fixed top-(--nav-bar-height) right-0 left-0 z-1 block border-t opacity-0 group-data-[content-scrolled=true]/sidebar-wrapper:hidden group-data-[content-scrolled=true]/sidebar-wrapper:opacity-100",
        )}
      />

      <nav
        data-slot="nav-bar"
        role="navigation"
        // w-[calc(100vw-var(--spacing-scrollbar-width))]
        className="fixed top-0 left-0 z-5 flex h-(--nav-bar-height) w-full items-center justify-start"
      >
        <div
          data-slot="nav-bar-left"
          className="z-1 box-border flex h-full w-(--sidebar-width) shrink-0 items-center pl-4 transition-[width] duration-200 ease-linear"
        >
          <SidebarTrigger />
        </div>

        <div
          data-slot="nav-bar-center"
          className="relative right-0 flex h-(--nav-bar-height) w-full shrink items-center justify-center py-2 lg:justify-start lg:pl-24"
        >
          search bar here
        </div>

        <div
          data-slot="nav-bar-right"
          className="z-1 flex shrink-0 items-center justify-end pr-24"
        >
          {session?.user ? (
            <UserButton user={session.user} />
          ) : (
            <Link
              href="/auth"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export function UserButton({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative size-8">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            fill
            sizes="100%"
            className="rounded-full"
          />
        ) : (
          <UserIcon className="size-8" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
