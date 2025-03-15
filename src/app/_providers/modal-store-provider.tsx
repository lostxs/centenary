"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import type { ModalStore } from "~/shared/lib/stores/modal-store";
import { createModalStore } from "~/shared/lib/stores/modal-store";

export type ModalStoreApi = ReturnType<typeof createModalStore>;

export const ModalStoreContext = createContext<ModalStoreApi | undefined>(
  undefined,
);

export function ModalStoreProvider({ children }: PropsWithChildren) {
  const [store] = useState(() => createModalStore());

  return (
    <ModalStoreContext.Provider value={store}>
      {children}
    </ModalStoreContext.Provider>
  );
}

export const useModalStore = <T,>(selector: (store: ModalStore) => T) => {
  const modalStoreContext = useContext(ModalStoreContext);

  if (!modalStoreContext) {
    throw new Error("useModalStore must be used within a ModalStoreProvider");
  }

  return useStore(modalStoreContext, selector);
};
