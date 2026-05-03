"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth-provider"

export default function RootPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    router.replace(user ? "/dashboard" : "/login")
  }, [router, user, isLoading])

  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <span className="font-serif italic text-2xl tracking-tight">SkillMap</span>
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  )
}
