import { createStore } from "zustand/vanilla";

export type ModalType = "upload-track";

export interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  data: Record<string, unknown> | null;
  isLoading: boolean;
}

export interface ModalActions {
  open: (type: ModalType) => void;
  close: () => void;
  setData: (data: Record<string, unknown>) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export type ModalStore = ModalState & ModalActions;

export const defaultInitialState: ModalState = {
  type: null,
  isOpen: false,
  data: null,
  isLoading: false,
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
        data: null,
        isLoading: false,
      }),
    setData: (data) => set({ data }),
    setIsLoading: (isLoading) => set({ isLoading }),
  }));
};
