"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  CheckCircle2,
  ListChecks,
  Map,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getRoadmaps } from "@/lib/storage"
import type { Roadmap } from "@/lib/types"

function pctOf(r: Roadmap): number {
  const items = [...r.skills, ...r.certifications, ...r.weeklyTasks]
  if (items.length === 0) return 0
  return Math.round((items.filter((i) => i.completed).length / items.length) * 100)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])

  useEffect(() => {
    if (!user) return
    setRoadmaps(getRoadmaps(user.id))
  }, [user])

  const stats = useMemo(() => {
    const totalItems = roadmaps.reduce(
      (sum, r) => sum + r.skills.length + r.certifications.length + r.weeklyTasks.length,
      0
    )
    const completedItems = roadmaps.reduce(
      (sum, r) =>
        sum +
        r.skills.filter((i) => i.completed).length +
        r.certifications.filter((i) => i.completed).length +
        r.weeklyTasks.filter((i) => i.completed).length,
      0
    )
    const avgProgress =
      roadmaps.length === 0
        ? 0
        : Math.round(roadmaps.reduce((sum, r) => sum + pctOf(r), 0) / roadmaps.length)
    return {
      total: roadmaps.length,
      totalItems,
      completedItems,
      avgProgress,
    }
  }, [roadmaps])

  const recent = useMemo(
    () => roadmaps.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
    [roadmaps]
  )

  const firstName = user?.name.split(/\s+/)[0] ?? "there"

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${firstName}.`}
        description="Here's where your roadmaps stand today."
        actions={
          <Button asChild size="sm">
            <Link href="/roadmaps/new">
              <Plus />
              New roadmap
            </Link>
          </Button>
        }
      />

      <div className="px-4 py-6 lg:px-8 lg:py-8 space-y-8">
        {/* Stats grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Roadmaps"
            value={stats.total}
            icon={<Map className="size-4 text-primary" />}
          />
          <StatCard
            label="Items completed"
            value={stats.completedItems}
            sub={`of ${stats.totalItems} total`}
            icon={<CheckCircle2 className="size-4 text-primary" />}
          />
          <StatCard
            label="Avg. progress"
            value={`${stats.avgProgress}%`}
            icon={<TrendingUp className="size-4 text-primary" />}
          />
          <StatCard
            label="Active goals"
            value={roadmaps.filter((r) => pctOf(r) > 0 && pctOf(r) < 100).length}
            icon={<ListChecks className="size-4 text-primary" />}
          />
        </section>

        {/* Recent roadmaps */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-xl tracking-tight">Recent roadmaps</h2>
                <p className="text-sm text-muted-foreground">
                  Pick up where you left off.
                </p>
              </div>
              {roadmaps.length > 0 && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/roadmaps">
                    View all
                    <ArrowUpRight />
                  </Link>
                </Button>
              )}
            </div>

            {recent.length === 0 ? (
              <EmptyRecent />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {recent.map((r) => (
                  <RecentCard key={r.id} roadmap={r} />
                ))}
              </div>
            )}
          </div>

          {/* Side panel */}
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-accent" />
                  Try a verified template
                </CardTitle>
                <CardDescription>
                  Frontend, Backend, or Mobile — start from a vetted structure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/roadmaps/new">Open the builder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-secondary/40 border-dashed">
              <CardHeader>
                <CardTitle className="text-base">A note on storage</CardTitle>
                <CardDescription>
                  Your account and roadmaps live in this browser only for now.
                  A persistent backend is the next milestone.
                </CardDescription>
              </CardHeader>
            </Card>
          </aside>
        </section>
      </div>
    </>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="font-serif text-3xl tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className="grid place-items-center size-9 rounded-md bg-secondary/60">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentCard({ roadmap }: { roadmap: Roadmap }) {
  const pct = pctOf(roadmap)
  return (
    <Link
      href={`/roadmaps/${roadmap.id}`}
      className="group block rounded-xl border bg-card p-4 transition hover:border-foreground/25 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base tracking-tight truncate group-hover:underline underline-offset-4">
            {roadmap.title}
          </h3>
          {roadmap.targetRole && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              → {roadmap.targetRole}
            </p>
          )}
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground shrink-0 mt-0.5" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{pct}%</span>
          <Badge variant="secondary" className="font-normal text-[10px]">
            {roadmap.skills.length + roadmap.certifications.length + roadmap.weeklyTasks.length}{" "}
            items
          </Badge>
        </div>
        <Progress value={pct} className="h-1" />
      </div>
    </Link>
  )
}

function EmptyRecent() {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center bg-secondary/20">
      <div className="grid place-items-center size-12 rounded-full bg-background mx-auto mb-4">
        <Map className="size-5 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-lg mb-1">No roadmaps yet</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
        Sketch out the path to your next role — start blank or load a template.
      </p>
      <Button asChild size="sm">
        <Link href="/roadmaps/new">
          <Plus />
          Start your first roadmap
        </Link>
      </Button>
    </div>
  )
}
