
import {create} from 'zustand';

const useAuth = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuthData: (data) => set({
    user: data,
    token: data.token,
    isAuthenticated: data.status,
  }),
  clearAuthData: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
  }),
}));

export default useAuth;
