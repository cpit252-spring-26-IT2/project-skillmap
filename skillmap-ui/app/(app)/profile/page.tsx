"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  CalendarDays,
  CheckCircle2,
  KeyRound,
  Loader2,
  Map,
  Trash2,
  TrendingUp,
  UserRound,
} from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { PageHeader } from "@/components/page-header"
import { getInitials } from "@/components/user-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { getRoadmaps } from "@/lib/storage"
import type { Roadmap } from "@/lib/types"

function progressOf(r: Roadmap): number {
  const items = [...r.skills, ...r.certifications, ...r.weeklyTasks]
  if (items.length === 0) return 0
  return Math.round((items.filter((i) => i.completed).length / items.length) * 100)
}

export default function ProfilePage() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth()
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])

  // Profile form
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Password form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwSubmitting, setPwSubmitting] = useState(false)
  const [pwMessage, setPwMessage] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setBio(user.bio ?? "")
    setTargetRole(user.targetRole ?? "")
    setRoadmaps(getRoadmaps(user.id))
  }, [user])

  const stats = useMemo(() => {
    const total = roadmaps.length
    const completedItems = roadmaps.reduce(
      (sum, r) =>
        sum +
        r.skills.filter((i) => i.completed).length +
        r.certifications.filter((i) => i.completed).length +
        r.weeklyTasks.filter((i) => i.completed).length,
      0
    )
    const avg =
      total === 0 ? 0 : Math.round(roadmaps.reduce((s, r) => s + progressOf(r), 0) / total)
    return { total, completedItems, avg }
  }, [roadmaps])

  if (!user) return null

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileError(null)
    setProfileMsg(null)
    try {
      updateProfile({ name, bio, targetRole })
      setProfileMsg("Profile updated.")
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not update profile.")
    }
  }

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPwError(null)
    setPwMessage(null)
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.")
      return
    }
    setPwSubmitting(true)
    try {
      await changePassword(currentPassword, newPassword)
      setPwMessage("Password changed successfully.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not change password.")
    } finally {
      setPwSubmitting(false)
    }
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Delete your account? All saved roadmaps in this browser will be removed permanently."
    )
    if (!confirmed) return
    deleteAccount()
    router.replace("/login")
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage how you appear in SkillMap and update your account details."
      />

      <div className="px-4 py-6 lg:px-8 lg:py-8 space-y-8 max-w-5xl">
        {/* Identity card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="grid place-items-center size-20 rounded-full bg-primary text-primary-foreground font-serif text-2xl shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <h2 className="font-serif text-2xl tracking-tight">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {user.targetRole && (
                    <Badge variant="secondary">→ {user.targetRole}</Badge>
                  )}
                  <Badge variant="outline" className="font-normal text-xs">
                    <CalendarDays className="size-3" />
                    Joined {memberSince}
                  </Badge>
                </div>
                {user.bio && (
                  <p className="text-sm text-foreground/80 pt-2 max-w-2xl">{user.bio}</p>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat
                icon={<Map className="size-4 text-primary" />}
                label="Roadmaps"
                value={stats.total}
              />
              <MiniStat
                icon={<CheckCircle2 className="size-4 text-primary" />}
                label="Items completed"
                value={stats.completedItems}
              />
              <MiniStat
                icon={<TrendingUp className="size-4 text-primary" />}
                label="Avg. progress"
                value={`${stats.avg}%`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Edit profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5 text-primary" />
              Personal details
            </CardTitle>
            <CardDescription>
              Update the information shown across your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className="space-y-5">
              {profileError && (
                <Alert variant="destructive">
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
              {profileMsg && (
                <Alert>
                  <CheckCircle2 className="size-4" />
                  <AlertDescription>{profileMsg}</AlertDescription>
                </Alert>
              )}

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                  <Input id="profile-email" value={user.email} disabled />
                  <FieldDescription>
                    Email is used to sign in and can&apos;t be changed in the demo.
                  </FieldDescription>
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="profile-target">Target career role</FieldLabel>
                  <Input
                    id="profile-target"
                    placeholder="e.g. Backend Developer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                  <FieldDescription>
                    Shown on your profile card and used as a default for new roadmaps.
                  </FieldDescription>
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="profile-bio">About</FieldLabel>
                  <Textarea
                    id="profile-bio"
                    rows={3}
                    placeholder="A line or two about yourself, your studies, or your goals."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="border-t pt-6 justify-end">
              <Button type="submit">Save changes</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Change password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              Change password
            </CardTitle>
            <CardDescription>
              Use a new password at least 6 characters long.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-5">
              {pwError && (
                <Alert variant="destructive">
                  <AlertDescription>{pwError}</AlertDescription>
                </Alert>
              )}
              {pwMessage && (
                <Alert>
                  <CheckCircle2 className="size-4" />
                  <AlertDescription>{pwMessage}</AlertDescription>
                </Alert>
              )}

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="current-pw">Current password</FieldLabel>
                  <Input
                    id="current-pw"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="new-pw">New password</FieldLabel>
                  <Input
                    id="new-pw"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-pw">Confirm new password</FieldLabel>
                  <Input
                    id="confirm-pw"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="border-t pt-6 justify-end">
              <Button type="submit" disabled={pwSubmitting}>
                {pwSubmitting && <Loader2 className="animate-spin" />}
                Update password
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="size-5" />
              Delete account
            </CardTitle>
            <CardDescription>
              Permanently remove your account and every roadmap saved in this browser.
              This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete my account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-lg border bg-secondary/30 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
        {icon}
        {label}
      </div>
      <p className="font-serif text-2xl tracking-tight">{value}</p>
    </div>
  )
}
