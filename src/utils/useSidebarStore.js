import { create} from 'zustand';

const useSidebarStore = create((set) => ({
  isSidebarVisible: false,
  toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
  showSidebar: () => set({ isSidebarVisible: true }),
  hideSidebar: () => set({ isSidebarVisible: false }),
}));

export default useSidebarStore;
