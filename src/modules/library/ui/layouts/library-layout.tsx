"use client";

import type { PropsWithChildren } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ToggleGroup, ToggleGroupItem } from "~/shared/ui/toggle-group";

const availableFilters = [
  "tracks",
  "playlists",
  "artists",
  "podcasts",
] as const;

type Filter = (typeof availableFilters)[number];

const filterLabels: Record<Filter, string> = {
  tracks: "Tracks",
  playlists: "Playlists",
  artists: "Artists",
  podcasts: "Podcasts",
} as const;

export function LibraryLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = pathname.split("/library/")[1] || "";

  const handleFilterChange = (value: Filter) => {
    if (activeFilter === value) {
      router.push("/library");
    } else {
      router.push(`/library/${value}`);
    }
  };

  return (
    <>
      <div className="mx-auto my-9 flex max-w-(--content-max-width) flex-wrap justify-between px-(--content-spacing)">
        <ToggleGroup
          variant="outline"
          type="single"
          value={activeFilter}
          onValueChange={(value: Filter) => handleFilterChange(value)}
        >
          {availableFilters.map((filter) => (
            <ToggleGroupItem key={filter} value={filter}>
              {filterLabels[filter]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {children}
    </>
  );
}
