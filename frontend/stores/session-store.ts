import { create } from 'zustand';

type SessionState = {
  token: string | null;
  user: {
    email: string;
    name: string;
  } | null;
  setSession: (session: { token: string; user: { email: string; name: string } }) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
}));
