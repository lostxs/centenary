import { createStore } from "zustand/vanilla";

import type { Track } from "~/drizzle/schema";

export interface PlayerState {
  queue: Track[];
  currentTrack: Track | null;
  currentTrackIndex: number | null;
  isPlaying: boolean;
}

export interface PlayerActions {
  play: (track: Track) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}

export type PlayerStore = PlayerState & PlayerActions;

export const defaultInitialState: PlayerState = {
  queue: [],
  currentTrack: null,
  currentTrackIndex: null,
  isPlaying: false,
};

export const createPlayerStore = (
  initialState: PlayerState = defaultInitialState,
) => {
  return createStore<PlayerStore>((set, get) => ({
    ...initialState,
    play: (track) => {
      const { queue } = get();
      const trackIndex = queue.findIndex(
        (t) => t.muxPlaybackId === track.muxPlaybackId,
      );
      if (trackIndex !== -1) {
        set({ currentTrackIndex: trackIndex, isPlaying: true });
      } else {
        set({
          queue: [...queue, track],
          currentTrackIndex: queue.length,
          isPlaying: true,
        });
      }
    },
    pause: () => set({ isPlaying: false }),
    next: () => {
      const { queue, currentTrackIndex } = get();
      if (currentTrackIndex !== null && currentTrackIndex < queue.length - 1) {
        set({ currentTrackIndex: currentTrackIndex + 1, isPlaying: true });
      }
    },
    previous: () => {
      const { currentTrackIndex } = get();
      if (currentTrackIndex !== null && currentTrackIndex > 0) {
        set({ currentTrackIndex: currentTrackIndex - 1, isPlaying: true });
      }
    },
    addToQueue: (track) => {
      const { queue } = get();
      set({ queue: [...queue, track] });
    },
    clearQueue: () =>
      set({ queue: [], currentTrackIndex: null, isPlaying: false }),
  }));
};
