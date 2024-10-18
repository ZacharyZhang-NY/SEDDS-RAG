import { create } from 'zustand'
import {useUserStore} from "@/store/user";

export const useStore = () => ({
  user: useUserStore()
})