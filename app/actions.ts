'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { type Chat } from '@/lib/types'

export async function getChats(userId?: string | null) {
  return []
}

export async function getChat(id: string, userId: string) {
  return null
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  return null
}

export async function clearChats() {
  return null
}

export async function getSharedChat(id: string) {
  return null
}

export async function shareChat(id: string) {
  return null
}

export async function saveChat(chat: Chat) {
  return null
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  return null
}
