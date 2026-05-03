"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Compass, MapPin, NotebookPen } from "lucide-react"

import { useAuth } from "@/components/auth-provider"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard")
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-background">
      {/* Left brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-paper-grid opacity-25" aria-hidden />
        <div
          className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-accent/40 blur-3xl"
          aria-hidden
        />

        <div className="relative flex items-center gap-3">
          <div className="grid place-items-center size-10 rounded-lg bg-background/10 ring-1 ring-background/20">
            <Compass className="size-5" strokeWidth={1.6} />
          </div>
          <span className="font-serif text-2xl tracking-tight">SkillMap</span>
        </div>

        <div className="relative space-y-8 max-w-md">
          <h1 className="font-serif text-5xl xl:text-6xl leading-[1.05] tracking-tight">
            Chart the path
            <br />
            to <em className="text-accent not-italic font-serif">where you're going.</em>
          </h1>
          <p className="text-base xl:text-lg text-primary-foreground/80 leading-relaxed">
            Build a personal roadmap of skills, certifications, and weekly goals.
            Track your progress. Make the journey visible.
          </p>

          <ul className="space-y-4 pt-4">
            <Feature icon={<MapPin className="size-4" strokeWidth={1.6} />}>
              Custom roadmaps tailored to the role you want
            </Feature>
            <Feature icon={<NotebookPen className="size-4" strokeWidth={1.6} />}>
              Weekly tasks, resources, and progress checklists
            </Feature>
            <Feature icon={<Compass className="size-4" strokeWidth={1.6} />}>
              Verified templates for Frontend, Backend, and Mobile
            </Feature>
          </ul>
        </div>

        <div className="relative text-sm text-primary-foreground/60">
          A senior project by Abdulaziz, Abdullah, and Abdulrahman.
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-col">
        <header className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl">
            <Compass className="size-5 text-primary" strokeWidth={1.6} />
            SkillMap
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  )
}

function Feature({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-primary-foreground/85">
      <span className="mt-0.5 grid place-items-center size-7 rounded-md bg-background/10 ring-1 ring-background/15">
        {icon}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  )
}
