"use client";

import MuxAudio from "@mux/mux-audio-react";

import { usePlayerStore } from "~/app/_providers/player-store-provider";

export function Player() {
  const playerStore = usePlayerStore((state) => state);
  const currentTrack = playerStore.currentTrack;
  const isPlaying = playerStore.isPlaying;
  const next = playerStore.next;
  const prev = playerStore.previous;

  if (!currentTrack) return null;

  console.log(currentTrack);

  return (
    <div className="fixed bottom-0 left-0 z-4 h-16">
      <MuxAudio
        envKey="5cu43mteglr80se0ksh749foc"
        playbackId={currentTrack.muxPlaybackId ?? undefined}
        metadata={{
          video_id: "audio-id-123456",
          video_title: currentTrack.title,
          viewer_user_id: "user-id-bc-789",
        }}
        preferPlayback="mse"
        controls
        autoPlay={isPlaying}
        onEnded={next}
      />
      <div className="flex gap-2">
        <button onClick={prev}>Previous</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}
