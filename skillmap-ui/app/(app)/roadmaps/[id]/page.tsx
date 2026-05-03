"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { useAuth } from "@/components/auth-provider"
import { RoadmapBuilder } from "@/components/roadmap-builder"
import { getRoadmap } from "@/lib/storage"
import type { Roadmap } from "@/lib/types"

export default function EditRoadmapPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (isLoading || !user) return
    const found = getRoadmap(user.id, params.id)
    if (!found) {
      setNotFound(true)
      return
    }
    setRoadmap(found)
  }, [user, isLoading, params.id])

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="font-serif text-2xl">Roadmap not found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          We couldn&apos;t find a roadmap with that id in your account.
        </p>
        <button
          onClick={() => router.push("/roadmaps")}
          className="text-sm text-foreground underline-offset-4 underline"
        >
          Back to roadmaps
        </button>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground font-serif italic">
        Loading roadmap…
      </div>
    )
  }

  return <RoadmapBuilder initial={roadmap} mode="edit" />
}
