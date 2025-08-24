import { create } from 'zustand';

interface AlertModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export const useAlertModal = create<AlertModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
