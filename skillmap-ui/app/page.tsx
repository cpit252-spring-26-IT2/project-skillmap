"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { AlertCircle, MapIcon, Sparkles } from "lucide-react"

interface Skill {
  name: string
  category: string
  completed: boolean
}

interface Certification {
  name: string
  category: string
  completed: boolean
}

interface Roadmap {
  title: string
  field: string
  track: string
  specialization: string
  skills: Skill[]
  certifications: Certification[]
}

type RoadmapSection = "skills" | "certifications"

export default function Home() {
  const [field, setField] = useState("IT")
  const [track, setTrack] = useState("Software Engineering")
  const [specialization, setSpecialization] = useState("")
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateRoadmap = async () => {
    if (!specialization) {
      setError("Please select a specialization")
      return
    }

    setIsLoading(true)
    setError(null)
    setRoadmap(null)

    try {
      const params = new URLSearchParams({
        field: field,
        track: track,
        specialization: specialization,
      })

      const response = await fetch(`http://localhost:8081/roadmap?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch roadmap")
      }
      const data = await response.json()
      setRoadmap(data)
    } catch (err) {
      setError(
        "Failed to fetch roadmap. Please make sure the backend is running on localhost:8081"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChecklistItem = (section: RoadmapSection, index: number, checked: boolean) => {
    setRoadmap((currentRoadmap) => {
      if (!currentRoadmap) {
        return currentRoadmap
      }

      const updatedItems = currentRoadmap[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, completed: checked } : item
      )

      return {
        ...currentRoadmap,
        [section]: updatedItems,
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <MapIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Skillmap Roadmap Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Generate a personalized software engineering roadmap
          </p>
        </div>

        {/* Selection Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configure Your Roadmap</CardTitle>
            <CardDescription>
              Select your field, track, and specialization to generate a customized learning path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid gap-6 sm:grid-cols-3">
              <Field>
                <FieldLabel>Field</FieldLabel>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Track</FieldLabel>
                <Select value={track} onValueChange={setTrack}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Specialization</FieldLabel>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleGenerateRoadmap}
                disabled={isLoading || !specialization}
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Roadmap
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!roadmap && !isLoading && !error && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <MapIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No Roadmap Generated Yet
              </h3>
              <p className="max-w-sm text-muted-foreground">
                Select your preferences above and click &quot;Generate Roadmap&quot; to see your
                personalized learning path.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Roadmap Display */}
        {roadmap && (
          <div className="space-y-6">
            {/* Roadmap Title Card */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">{roadmap.title}</CardTitle>
                <CardDescription className="text-base">
                  {roadmap.field} &bull; {roadmap.track} &bull; {roadmap.specialization}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Skills Section */}
            {roadmap.skills && roadmap.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Skills</CardTitle>
                  <CardDescription>
                    Core skills to master for your specialization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {roadmap.skills.map((skill, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Checkbox
                          id={`skill-${index}`}
                          checked={skill.completed}
                          onCheckedChange={(checked) =>
                            toggleChecklistItem("skills", index, checked === true)
                          }
                        />
                        <label
                          htmlFor={`skill-${index}`}
                          className={`text-sm font-medium leading-none ${
                            skill.completed
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {skill.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Certifications Section */}
            {roadmap.certifications && roadmap.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Certifications</CardTitle>
                  <CardDescription>
                    Recommended certifications to validate your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {roadmap.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Checkbox
                          id={`cert-${index}`}
                          checked={cert.completed}
                          onCheckedChange={(checked) =>
                            toggleChecklistItem("certifications", index, checked === true)
                          }
                        />
                        <label
                          htmlFor={`cert-${index}`}
                          className={`text-sm font-medium leading-none ${
                            cert.completed
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {cert.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
