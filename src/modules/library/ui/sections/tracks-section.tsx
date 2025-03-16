"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlayIcon, PlusIcon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import type { Track } from "~/drizzle/schema";
import { usePlayerStore } from "~/app/_providers/player-store-provider";
import { useTRPC } from "~/shared/lib/trpc/client";
import { formatDuration } from "~/shared/lib/utils";
import { Button } from "~/shared/ui/button";

export function TracksSection() {
  return (
    <Suspense fallback={<TracksSectionSkeleton />}>
      <ErrorBoundary fallback={<TracksSectionSkeleton />}>
        <TracksSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

export function TracksSectionSkeleton() {
  return <div>Tracks Skeleton</div>;
}

export function TracksSectionSuspense() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.library.getTracks.queryOptions());

  return (
    <div className="grid grid-rows-2">
      {data.map((track, index) => (
        <TrackCard key={track.id} track={track} index={index} />
      ))}
    </div>
  );
}

function TrackCard({ track, index }: { track: Track; index: number }) {
  const playerStore = usePlayerStore((state) => state);

  const handlePlay = () => {
    if (playerStore.currentTrack?.id === track.id && playerStore.isPlaying) {
      playerStore.pause();
    } else {
      playerStore.play(track);
    }
  };

  const handleAddToQueue = () => {
    playerStore.addToQueue(track);
  };

  return (
    <div className="group/treegrid-item hover:bg-accent relative z-0 grid min-h-14 min-w-14 grid-cols-[10px_40px_auto] grid-rows-1 gap-2 px-2 transition-colors">
      {/* Key */}
      <div className="flex items-center justify-center">
        <span className="text-muted-foreground text-xs">{index}</span>
      </div>
      <div className="bg-accent relative size-10 self-center">
        <Image
          src={"/placeholder.jpg"}
          alt=""
          fill
          sizes="100%"
          className="object-cover object-center"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover/treegrid-item:opacity-100">
          <PlayButton onClick={handlePlay} />
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex max-w-full flex-col items-start gap-0.5">
          <p className="text-primary whitespace-pre-line">
            <span className="line-clamp-1">{track.title}</span>
          </p>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            <Link
              href={"/artist/1"}
              className="text-ellipsis whitespace-nowrap hover:underline"
            >
              {track.muxPlaybackId}
            </Link>
          </p>
        </div>

        {/* Duration */}
        <span className="text-muted-foreground text-xs">
          {formatDuration(track.duration)}
        </span>

        <Button variant="outline" size="icon" onClick={handleAddToQueue}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      <PlayIcon />
    </Button>
  );
}
