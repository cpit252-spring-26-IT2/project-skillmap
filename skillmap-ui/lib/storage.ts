// Tiny localStorage wrapper. Keeps keys consistent and namespaced so each
// signed-in user has their own roadmap collection separate from others.

import type { Roadmap, User } from "./types"

const KEYS = {
  users: "skillmap:users",
  session: "skillmap:session",
  roadmaps: (userId: string) => `skillmap:user:${userId}:roadmaps`,
} as const

interface Session {
  userId: string
  signedInAt: string
}

function isBrowser() {
  return typeof window !== "undefined"
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!isBrowser()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

// ------- Users -------

export function getUsers(): User[] {
  return readJSON<User[]>(KEYS.users, [])
}

export function saveUsers(users: User[]) {
  writeJSON(KEYS.users, users)
}

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase()
  return getUsers().find((u) => u.email.toLowerCase() === normalized)
}

export function findUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id)
}

export function upsertUser(user: User) {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === user.id)
  if (idx === -1) users.push(user)
  else users[idx] = user
  saveUsers(users)
}

// ------- Session -------

export function getSession(): Session | null {
  return readJSON<Session | null>(KEYS.session, null)
}

export function setSession(session: Session | null) {
  if (!isBrowser()) return
  if (session) writeJSON(KEYS.session, session)
  else window.localStorage.removeItem(KEYS.session)
}

// ------- Roadmaps (per user) -------

export function getRoadmaps(userId: string): Roadmap[] {
  return readJSON<Roadmap[]>(KEYS.roadmaps(userId), [])
}

export function saveRoadmaps(userId: string, roadmaps: Roadmap[]) {
  writeJSON(KEYS.roadmaps(userId), roadmaps)
}

export function upsertRoadmap(userId: string, roadmap: Roadmap): Roadmap[] {
  const list = getRoadmaps(userId)
  const idx = list.findIndex((r) => r.id === roadmap.id)
  const next = { ...roadmap, updatedAt: new Date().toISOString() }
  if (idx === -1) list.unshift(next)
  else list[idx] = next
  saveRoadmaps(userId, list)
  return list
}

export function deleteRoadmap(userId: string, roadmapId: string): Roadmap[] {
  const next = getRoadmaps(userId).filter((r) => r.id !== roadmapId)
  saveRoadmaps(userId, next)
  return next
}

export function getRoadmap(userId: string, roadmapId: string): Roadmap | undefined {
  return getRoadmaps(userId).find((r) => r.id === roadmapId)
}
