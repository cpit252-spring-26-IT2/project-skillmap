"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Info, Loader2 } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setSubmitting(true)
    try {
      await signup({ name, email, password })
      router.replace("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl tracking-tight">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          A few details and you&apos;re ready to start mapping.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Sarah Al-Hamad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 transition"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldDescription>Use 6 or more characters.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Field>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>

      <Alert className="bg-secondary/50">
        <Info className="size-4" />
        <AlertDescription className="text-xs">
          Account data is stored only in this browser for the demo. Don&apos;t reuse
          a real password — backend auth is part of the next milestone.
        </AlertDescription>
      </Alert>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
