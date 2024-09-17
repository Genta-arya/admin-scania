import {create} from "zustand";

export const useCodeStore = create((set) => ({
  data: [],
  setData: (newData) => set({ data: newData }),
}));
