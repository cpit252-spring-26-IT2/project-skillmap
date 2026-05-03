// Frontend-only auth utilities. Passwords are hashed with SHA-256 plus a
// per-user random salt before being written to localStorage.
//
// NOTE: This is a class-project simulation, not production security. Real
// applications must authenticate on a server with proper key-derivation
// (Argon2/bcrypt), HTTPS-only cookies, and rate limiting.

import {
  findUserByEmail,
  findUserById,
  getSession,
  saveUsers,
  setSession,
  upsertUser,
  getUsers,
} from "./storage"
import type { PublicUser, User } from "./types"

const PASSWORD_MIN_LENGTH = 6

function toPublic(user: User): PublicUser {
  const { passwordHash: _p, salt: _s, ...rest } = user
  return rest
}

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}::${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return bytesToHex(digest)
}

function generateSalt(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export interface SignupInput {
  name: string
  email: string
  password: string
}

export async function signup(input: SignupInput): Promise<PublicUser> {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  const password = input.password

  if (!name) throw new Error("Please enter your name.")
  if (!isValidEmail(email)) throw new Error("Please enter a valid email address.")
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  }
  if (findUserByEmail(email)) {
    throw new Error("An account with this email already exists.")
  }

  const salt = generateSalt()
  const passwordHash = await hashPassword(password, salt)
  const user: User = {
    id: generateId(),
    name,
    email,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  upsertUser(user)
  setSession({ userId: user.id, signedInAt: new Date().toISOString() })
  return toPublic(user)
}

export async function login(email: string, password: string): Promise<PublicUser> {
  const user = findUserByEmail(email)
  if (!user) throw new Error("No account matches that email and password.")
  const hash = await hashPassword(password, user.salt)
  if (hash !== user.passwordHash) {
    throw new Error("No account matches that email and password.")
  }
  setSession({ userId: user.id, signedInAt: new Date().toISOString() })
  return toPublic(user)
}

export function logout() {
  setSession(null)
}

export function getCurrentUser(): PublicUser | null {
  const session = getSession()
  if (!session) return null
  const user = findUserById(session.userId)
  return user ? toPublic(user) : null
}

export interface ProfileUpdate {
  name?: string
  bio?: string
  targetRole?: string
}

export function updateProfile(userId: string, update: ProfileUpdate): PublicUser {
  const user = findUserById(userId)
  if (!user) throw new Error("Account not found.")
  const next: User = {
    ...user,
    name: update.name?.trim() || user.name,
    bio: update.bio?.trim() ?? user.bio,
    targetRole: update.targetRole?.trim() ?? user.targetRole,
  }
  if (!next.name) throw new Error("Name cannot be empty.")
  upsertUser(next)
  return toPublic(next)
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = findUserById(userId)
  if (!user) throw new Error("Account not found.")
  const currentHash = await hashPassword(currentPassword, user.salt)
  if (currentHash !== user.passwordHash) {
    throw new Error("Current password is incorrect.")
  }
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`New password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  }
  const newSalt = generateSalt()
  const newHash = await hashPassword(newPassword, newSalt)
  upsertUser({ ...user, salt: newSalt, passwordHash: newHash })
}

export function deleteAccount(userId: string) {
  const remaining = getUsers().filter((u) => u.id !== userId)
  saveUsers(remaining)
  setSession(null)
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(`skillmap:user:${userId}:roadmaps`)
  }
}
