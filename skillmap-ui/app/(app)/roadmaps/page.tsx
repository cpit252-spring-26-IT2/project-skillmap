"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Map, Plus, Trash2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { deleteRoadmap, getRoadmaps } from "@/lib/storage"
import type { Roadmap } from "@/lib/types"

function progressOf(r: Roadmap): number {
  const items = [...r.skills, ...r.certifications, ...r.weeklyTasks]
  if (items.length === 0) return 0
  return Math.round((items.filter((i) => i.completed).length / items.length) * 100)
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const day = 86_400_000
  if (diff < 60_000) return "just now"
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < day) return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < day * 7) return `${Math.floor(diff / day)}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function RoadmapsPage() {
  const { user } = useAuth()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])

  useEffect(() => {
    if (!user) return
    setRoadmaps(getRoadmaps(user.id))
  }, [user])

  const sorted = useMemo(
    () => roadmaps.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [roadmaps]
  )

  const handleDelete = (id: string) => {
    if (!user) return
    if (!confirm("Delete this roadmap? This cannot be undone.")) return
    setRoadmaps(deleteRoadmap(user.id, id))
  }

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="My roadmaps"
        description="Every plan you've started or saved. Pick one up where you left off."
        actions={
          <Button asChild size="sm">
            <Link href="/roadmaps/new">
              <Plus />
              New roadmap
            </Link>
          </Button>
        }
      />

      <div className="px-4 py-6 lg:px-8 lg:py-8">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((r) => (
              <RoadmapCard key={r.id} roadmap={r} onDelete={() => handleDelete(r.id)} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function RoadmapCard({ roadmap, onDelete }: { roadmap: Roadmap; onDelete: () => void }) {
  const pct = progressOf(roadmap)
  const items =
    roadmap.skills.length + roadmap.certifications.length + roadmap.weeklyTasks.length

  return (
    <Card className="group relative overflow-hidden transition hover:border-foreground/25 hover:shadow-sm">
      <CardHeader className="space-y-1.5">
        <div className="flex items-start gap-2">
          <CardTitle className="font-serif text-lg leading-tight">
            <Link href={`/roadmaps/${roadmap.id}`} className="hover:underline underline-offset-4">
              {roadmap.title || "Untitled"}
            </Link>
          </CardTitle>
        </div>
        {roadmap.targetRole && (
          <p className="text-sm text-muted-foreground">→ {roadmap.targetRole}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono text-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          <Badge variant="secondary" className="font-normal">
            {roadmap.skills.length} skills
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {roadmap.certifications.length} certs
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {roadmap.weeklyTasks.length} tasks
          </Badge>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">
            {items === 0 ? "Empty" : `Updated ${relativeTime(roadmap.updatedAt)}`}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete roadmap"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/roadmaps/${roadmap.id}`}>
                Open
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="grid place-items-center size-16 rounded-full bg-secondary mb-6">
        <Map className="size-7 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-2xl tracking-tight mb-2">
        Your library is empty
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Start a roadmap from scratch or load one of the verified templates. You
        can edit it anytime.
      </p>
      <Button asChild>
        <Link href="/roadmaps/new">
          <Plus />
          Create your first roadmap
        </Link>
      </Button>
    </div>
  )
}
