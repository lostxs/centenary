"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { LogOutIcon, UploadIcon, UserIcon } from "lucide-react";

import type { auth, User } from "~/shared/lib/auth/server";
import { useModalStore } from "~/app/_providers";
import { useTRPC } from "~/shared/lib/trpc/client";
import { cn } from "~/shared/lib/utils";
import { buttonVariants } from "~/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  const trpc = useTRPC();
  const modalStore = useModalStore((state) => state);

  const { mutate: createUpload } = useMutation(
    trpc.tracks.createUpload.mutationOptions({
      onSuccess: (data) => {
        modalStore.setData({
          uploadId: data.uploadId,
          uploadUrl: data.uploadUrl,
        });
        modalStore.setIsLoading(false);
      },
      onError: (error) => {
        console.error(error);
        modalStore.setIsLoading(false);
      },
    }),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 px-0 py-1">
        <div className="flex items-center gap-4 p-4">
          <UserAvatar user={user} size="md" />
          <div className="flex flex-col">
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
        <DropdownMenuItem
          className="gap-4 rounded-none px-4"
          onClick={() => {
            modalStore.open("upload-track");
            modalStore.setIsLoading(true);
            createUpload(undefined);
          }}
        >
          <UploadIcon className="size-6" />
          Upload Track
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-4 rounded-none px-4">
          <LogOutIcon className="size-6" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const avatarSizes = cva("relative overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

interface UserAvatarProps extends React.ComponentProps<"div"> {
  user: User;
  size?: "sm" | "md" | "lg";
}

function UserAvatar({
  user,
  size = "sm",
  className,
  ...props
}: UserAvatarProps) {
  return (
    <div className={cn(avatarSizes({ size }), className)} {...props}>
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name}
          fill
          sizes="100%"
          className="rounded-full object-cover object-center"
        />
      ) : (
        <UserIcon className={avatarSizes({ size })} />
      )}
    </div>
  );
}
