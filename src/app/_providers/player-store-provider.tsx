"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import type { PlayerStore } from "~/shared/lib/stores/player-store";
import { createPlayerStore } from "~/shared/lib/stores/player-store";

export type PlayerStoreApi = ReturnType<typeof createPlayerStore>;

export const PlayerStoreContext = createContext<PlayerStoreApi | undefined>(
  undefined,
);

export function PlayerStoreProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => createPlayerStore());

  return (
    <PlayerStoreContext.Provider value={store}>
      {children}
    </PlayerStoreContext.Provider>
  );
}

export const usePlayerStore = <T,>(selector: (store: PlayerStore) => T) => {
  const playerStoreContext = useContext(PlayerStoreContext);

  if (!playerStoreContext) {
    throw new Error("usePlayerStore must be used within a PlayerStoreProvider");
  }

  return useStore(playerStoreContext, selector);
};
