"use client"

import { useMemo } from "react"

import { RoadmapBuilder, emptyRoadmap } from "@/components/roadmap-builder"

export default function NewRoadmapPage() {
  const initial = useMemo(() => emptyRoadmap(), [])
  return <RoadmapBuilder initial={initial} mode="new" />
}
