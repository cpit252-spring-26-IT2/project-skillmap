"use client"

import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react"
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  FileUp,
  History,
  LinkIcon,
  ListChecks,
  MapIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ChecklistKind = "skills" | "certifications"

interface ChecklistItem {
  id: string
  name: string
  category: string
  completed: boolean
}

interface WeeklyTask {
  id: string
  week: number
  title: string
  description: string
  completed: boolean
}

interface ResourceItem {
  id: string
  name: string
  type: string
  reference: string
}

interface Roadmap {
  id: string
  title: string
  field: string
  track: string
  targetRole: string
  skills: ChecklistItem[]
  certifications: ChecklistItem[]
  weeklyTasks: WeeklyTask[]
  resources: ResourceItem[]
  savedAt?: string
}

interface TemplateRoadmap {
  title: string
  field: string
  track: string
  specialization: string
  skills: Array<Omit<ChecklistItem, "id">>
  certifications: Array<Omit<ChecklistItem, "id">>
}

const STORAGE_KEY = "skillmap-roadmap-history"

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`

const emptyRoadmap = (): Roadmap => ({
  id: createId(),
  title: "My Career Roadmap",
  field: "IT",
  track: "Software Engineering",
  targetRole: "",
  skills: [],
  certifications: [],
  weeklyTasks: [],
  resources: [],
})

export default function Home() {
  const [roadmap, setRoadmap] = useState<Roadmap>(emptyRoadmap)
  const [history, setHistory] = useState<Roadmap[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [taskDraft, setTaskDraft] = useState({ week: 1, title: "", description: "" })
  const [resourceDraft, setResourceDraft] = useState({ name: "", type: "link", reference: "" })
  const [templateSpecialization, setTemplateSpecialization] = useState("Frontend")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedHistory = window.localStorage.getItem(STORAGE_KEY)
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const progress = useMemo(() => {
    const items = [...roadmap.skills, ...roadmap.certifications, ...roadmap.weeklyTasks]
    if (items.length === 0) {
      return 0
    }

    return Math.round((items.filter((item) => item.completed).length / items.length) * 100)
  }, [roadmap])

  const updateRoadmap = (changes: Partial<Roadmap>) => {
    setRoadmap((current) => ({ ...current, ...changes }))
  }

  const addChecklistItem = (kind: ChecklistKind) => {
    const value = kind === "skills" ? newSkill.trim() : newCertification.trim()
    if (!value) {
      return
    }

    const item: ChecklistItem = {
      id: createId(),
      name: value,
      category: kind === "skills" ? "skill" : "certification",
      completed: false,
    }

    setRoadmap((current) => ({ ...current, [kind]: [...current[kind], item] }))

    if (kind === "skills") {
      setNewSkill("")
    } else {
      setNewCertification("")
    }
  }

  const toggleChecklistItem = (kind: ChecklistKind, id: string, completed: boolean) => {
    setRoadmap((current) => ({
      ...current,
      [kind]: current[kind].map((item) => (item.id === id ? { ...item, completed } : item)),
    }))
  }

  const removeChecklistItem = (kind: ChecklistKind, id: string) => {
    setRoadmap((current) => ({
      ...current,
      [kind]: current[kind].filter((item) => item.id !== id),
    }))
  }

  const addWeeklyTask = () => {
    if (!taskDraft.title.trim()) {
      return
    }

    const task: WeeklyTask = {
      id: createId(),
      week: taskDraft.week,
      title: taskDraft.title.trim(),
      description: taskDraft.description.trim(),
      completed: false,
    }

    setRoadmap((current) => ({ ...current, weeklyTasks: [...current.weeklyTasks, task] }))
    setTaskDraft({ week: taskDraft.week + 1, title: "", description: "" })
  }

  const toggleWeeklyTask = (id: string, completed: boolean) => {
    setRoadmap((current) => ({
      ...current,
      weeklyTasks: current.weeklyTasks.map((task) =>
        task.id === id ? { ...task, completed } : task
      ),
    }))
  }

  const removeWeeklyTask = (id: string) => {
    setRoadmap((current) => ({
      ...current,
      weeklyTasks: current.weeklyTasks.filter((task) => task.id !== id),
    }))
  }

  const addResource = () => {
    if (!resourceDraft.name.trim()) {
      return
    }

    setRoadmap((current) => ({
      ...current,
      resources: [
        ...current.resources,
        {
          id: createId(),
          name: resourceDraft.name.trim(),
          type: resourceDraft.type,
          reference: resourceDraft.reference.trim(),
        },
      ],
    }))
    setResourceDraft({ name: "", type: "link", reference: "" })
  }

  const addUploadedResources = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) {
      return
    }

    setRoadmap((current) => ({
      ...current,
      resources: [
        ...current.resources,
        ...files.map((file) => ({
          id: createId(),
          name: file.name,
          type: "file",
          reference: `${Math.ceil(file.size / 1024)} KB`,
        })),
      ],
    }))
    event.target.value = ""
  }

  const removeResource = (id: string) => {
    setRoadmap((current) => ({
      ...current,
      resources: current.resources.filter((resource) => resource.id !== id),
    }))
  }

  const loadVerifiedTemplate = async () => {
    setError(null)
    setMessage(null)

    try {
      const params = new URLSearchParams({
        field: "IT",
        track: "Software Engineering",
        specialization: templateSpecialization,
      })
      const response = await fetch(`http://localhost:8081/roadmap?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Template request failed")
      }

      const template: TemplateRoadmap = await response.json()
      setRoadmap({
        id: createId(),
        title: template.title,
        field: template.field,
        track: template.track,
        targetRole: template.specialization,
        skills: template.skills.map((item) => ({ ...item, id: createId() })),
        certifications: template.certifications.map((item) => ({ ...item, id: createId() })),
        weeklyTasks: [],
        resources: [],
      })
      setMessage("Verified template loaded. You can edit it before saving.")
    } catch {
      setError("Could not load the verified template. Make sure the backend is running on port 8081.")
    }
  }

  const saveRoadmap = async () => {
    setError(null)
    setMessage(null)

    if (!roadmap.title.trim() || !roadmap.targetRole.trim()) {
      setError("Roadmap title and target role are required.")
      return
    }

    if (roadmap.skills.length + roadmap.certifications.length + roadmap.weeklyTasks.length === 0) {
      setError("Add at least one skill, certification, or weekly task before saving.")
      return
    }

    const savedRoadmap = { ...roadmap, savedAt: new Date().toISOString() }
    const nextHistory = [savedRoadmap, ...history.filter((item) => item.id !== roadmap.id)].slice(0, 10)
    setHistory(nextHistory)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory))

    try {
      await fetch("http://localhost:8081/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...savedRoadmap,
          skills: savedRoadmap.skills.map(({ name, category, completed }) => ({
            name,
            category,
            completed,
          })),
          certifications: savedRoadmap.certifications.map(({ name, category, completed }) => ({
            name,
            category,
            completed,
          })),
          weeklyTasks: savedRoadmap.weeklyTasks.map(({ week, title, description, completed }) => ({
            week,
            title,
            description,
            completed,
          })),
          resources: savedRoadmap.resources.map(({ name, type, reference }) => ({
            name,
            type,
            reference,
          })),
        }),
      })
      setMessage("Roadmap saved to history and validated by the backend builder.")
    } catch {
      setMessage("Roadmap saved to local history. Backend validation is unavailable right now.")
    }
  }

  const loadFromHistory = (selectedRoadmap: Roadmap) => {
    setRoadmap(selectedRoadmap)
    setMessage("Saved roadmap loaded.")
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <MapIcon className="h-9 w-9 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                SkillMap Roadmap Builder
              </h1>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              Build a career roadmap manually, track progress, and keep saved versions for later.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setRoadmap(emptyRoadmap())}>
              <Plus />
              New Roadmap
            </Button>
            <Button onClick={saveRoadmap}>
              <Save />
              Save Roadmap
            </Button>
          </div>
        </header>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Action needed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Updated</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Roadmap Details</CardTitle>
                <CardDescription>
                  Define the goal before adding skills, certifications, tasks, and resources.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      value={roadmap.title}
                      onChange={(event) => updateRoadmap({ title: event.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Target Role</FieldLabel>
                    <Input
                      placeholder="Backend Developer"
                      value={roadmap.targetRole}
                      onChange={(event) => updateRoadmap({ targetRole: event.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Field</FieldLabel>
                    <Input
                      value={roadmap.field}
                      onChange={(event) => updateRoadmap({ field: event.target.value })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Track</FieldLabel>
                    <Input
                      value={roadmap.track}
                      onChange={(event) => updateRoadmap({ track: event.target.value })}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <BuilderList
                title="Skills"
                description="Add practical skills and mark them complete as you learn."
                icon={<BookOpenCheck className="h-5 w-5" />}
                inputValue={newSkill}
                inputPlaceholder="Spring Boot"
                addLabel="Add Skill"
                items={roadmap.skills}
                onInputChange={setNewSkill}
                onAdd={() => addChecklistItem("skills")}
                onToggle={(id, checked) => toggleChecklistItem("skills", id, checked)}
                onRemove={(id) => removeChecklistItem("skills", id)}
              />

              <BuilderList
                title="Certifications"
                description="Add certifications or courses that support the roadmap."
                icon={<Award className="h-5 w-5" />}
                inputValue={newCertification}
                inputPlaceholder="Oracle Java Certification"
                addLabel="Add Certification"
                items={roadmap.certifications}
                onInputChange={setNewCertification}
                onAdd={() => addChecklistItem("certifications")}
                onToggle={(id, checked) => toggleChecklistItem("certifications", id, checked)}
                onRemove={(id) => removeChecklistItem("certifications", id)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  Weekly Tasks
                </CardTitle>
                <CardDescription>
                  Break the roadmap into week-by-week actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
                  <Field>
                    <FieldLabel>Week</FieldLabel>
                    <Input
                      min={1}
                      type="number"
                      value={taskDraft.week}
                      onChange={(event) =>
                        setTaskDraft((current) => ({
                          ...current,
                          week: Number(event.target.value),
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Task Title</FieldLabel>
                    <Input
                      placeholder="Build a portfolio API"
                      value={taskDraft.title}
                      onChange={(event) =>
                        setTaskDraft((current) => ({ ...current, title: event.target.value }))
                      }
                    />
                  </Field>
                  <Field className="md:col-span-2">
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      placeholder="Create CRUD endpoints and test them with sample data."
                      value={taskDraft.description}
                      onChange={(event) =>
                        setTaskDraft((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
                <Button variant="outline" onClick={addWeeklyTask}>
                  <Plus />
                  Add Weekly Task
                </Button>

                <div className="space-y-3">
                  {roadmap.weeklyTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex gap-3 rounded-md border p-3"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => toggleWeeklyTask(task.id, checked === true)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">Week {task.week}</Badge>
                          <p
                            className={`font-medium ${
                              task.completed ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {task.title}
                          </p>
                        </div>
                        {task.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                        )}
                      </div>
                      <Button
                        aria-label="Remove weekly task"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeWeeklyTask(task.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5" />
                  Supporting Resources
                </CardTitle>
                <CardDescription>
                  Attach file references or add useful links for the roadmap.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
                  <Select
                    value={resourceDraft.type}
                    onValueChange={(type) => setResourceDraft((current) => ({ ...current, type }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="file">File Note</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Resource name"
                    value={resourceDraft.name}
                    onChange={(event) =>
                      setResourceDraft((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                  <Input
                    className="md:col-span-2"
                    placeholder="URL, file note, or reference"
                    value={resourceDraft.reference}
                    onChange={(event) =>
                      setResourceDraft((current) => ({
                        ...current,
                        reference: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={addResource}>
                    <LinkIcon />
                    Add Resource
                  </Button>
                  <Button variant="outline" asChild>
                    <label>
                      <FileUp />
                      Upload File
                      <input className="hidden" multiple type="file" onChange={addUploadedResources} />
                    </label>
                  </Button>
                </div>

                <div className="space-y-2">
                  {roadmap.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center gap-3 rounded-md border p-3"
                    >
                      <Badge variant="outline">{resource.type}</Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{resource.name}</p>
                        {resource.reference && (
                          <p className="truncate text-sm text-muted-foreground">
                            {resource.reference}
                          </p>
                        )}
                      </div>
                      <Button
                        aria-label="Remove resource"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeResource(resource.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                  {progress}% complete across skills, certifications, and tasks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={progress} />
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <Stat label="Skills" value={roadmap.skills.length} />
                  <Stat label="Certs" value={roadmap.certifications.length} />
                  <Stat label="Tasks" value={roadmap.weeklyTasks.length} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verified Templates</CardTitle>
                <CardDescription>
                  Use the existing Factory Pattern templates as a starting point.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={templateSpecialization} onValueChange={setTemplateSpecialization}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full" variant="outline" onClick={loadVerifiedTemplate}>
                  Load Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Saved History
                </CardTitle>
                <CardDescription>
                  Recent roadmaps saved in this browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No saved roadmaps yet.</p>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      className="w-full rounded-md border p-3 text-left transition hover:bg-accent"
                      onClick={() => loadFromHistory(item)}
                    >
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.targetRole}</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  )
}

function BuilderList({
  title,
  description,
  icon,
  inputValue,
  inputPlaceholder,
  addLabel,
  items,
  onInputChange,
  onAdd,
  onToggle,
  onRemove,
}: {
  title: string
  description: string
  icon: ReactNode
  inputValue: string
  inputPlaceholder: string
  addLabel: string
  items: ChecklistItem[]
  onInputChange: (value: string) => void
  onAdd: () => void
  onToggle: (id: string, checked: boolean) => void
  onRemove: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onAdd()
              }
            }}
          />
          <Button variant="outline" onClick={onAdd}>
            <Plus />
            {addLabel}
          </Button>
        </div>

        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No items added yet.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-md border p-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked) => onToggle(item.id, checked === true)}
                />
                <p
                  className={`min-w-0 flex-1 truncate font-medium ${
                    item.completed ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {item.name}
                </p>
                <Button
                  aria-label={`Remove ${item.name}`}
                  size="icon"
                  variant="ghost"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}
