import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SessionState = {
  token: string | null;
  user: {
    email: string;
    name: string;
  } | null;
  hasHydrated: boolean;
  setSession: (session: { token: string; user: { email: string; name: string } }) => void;
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setSession: ({ token, user }) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          throw new Error('Session storage is only available in the browser.');
        }

        return AsyncStorage;
      }),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to hydrate session storage.', error);
        }

        state?.setHasHydrated(true);
      },
    },
  ),
);
