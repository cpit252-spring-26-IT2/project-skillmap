// Shared types used across the SkillMap app.

export interface User {
  id: string
  name: string
  email: string
  bio?: string
  targetRole?: string
  passwordHash: string
  salt: string
  createdAt: string
}

export type PublicUser = Omit<User, "passwordHash" | "salt">

export interface ChecklistItem {
  id: string
  name: string
  category: string
  completed: boolean
}

export interface WeeklyTask {
  id: string
  week: number
  title: string
  description: string
  completed: boolean
}

export interface ResourceItem {
  id: string
  name: string
  type: string
  reference: string
}

export interface Roadmap {
  id: string
  title: string
  field: string
  track: string
  targetRole: string
  skills: ChecklistItem[]
  certifications: ChecklistItem[]
  weeklyTasks: WeeklyTask[]
  resources: ResourceItem[]
  createdAt: string
  updatedAt: string
}

export interface TemplateRoadmap {
  title: string
  field: string
  track: string
  specialization: string
  skills: Array<Omit<ChecklistItem, "id">>
  certifications: Array<Omit<ChecklistItem, "id">>
}
