import { createStore } from "zustand/vanilla";

export type ModalType = "upload-track";

export interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
}

export interface ModalActions {
  open: (type: ModalType) => void;
  close: () => void;
}

export type ModalStore = ModalState & ModalActions;

export const defaultInitialState: ModalState = {
  type: null,
  isOpen: false,
};

export const createModalStore = (
  initialState: ModalState = defaultInitialState,
) => {
  return createStore<ModalStore>((set) => ({
    ...initialState,
    open: (type) => set({ type, isOpen: true }),
    close: () =>
      set({
        isOpen: false,
        type: null,
      }),
  }));
};
