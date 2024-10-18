import { create } from 'zustand'
import {Session} from "@/lib/types";

type UserStore = {
  session: Session | null;
  user: { id: string; email: string } | null;
  setSession: (session: Session | null) => void;
  logout: () => void;
};

type User = {
  id: string;
  email: string;
};


export const useUserStore = create<UserStore>((set) => ({
  session: null,
  user: null,
  setSession: (session) => set({
    session,
    user: session ? session.user : null
  }),
  logout: () => set({ session: null })
}))
