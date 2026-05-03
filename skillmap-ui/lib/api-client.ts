import type { Roadmap, TemplateRoadmap } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081"

/**
 * Facade Pattern Implementation for the Frontend
 * 
 * This class hides the complexity of making HTTP requests, setting headers,
 * handling JSON serialization/deserialization, and error throwing.
 * 
 * UI components can simply call ApiClient.loadTemplate("Frontend") without
 * needing to know about `fetch`, URLs, or response processing.
 */
export class ApiClientFacade {
  
  /**
   * Fetches a predefined roadmap template from the backend.
   */
  static async getTemplate(specialization: string): Promise<TemplateRoadmap> {
    const params = new URLSearchParams({
      field: "IT",
      track: "Software Engineering",
      specialization: specialization,
    })
    
    const response = await fetch(`${API_URL}/roadmap?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Template request failed with status: ${response.status}`)
    }
    
    return await response.json()
  }

  /**
   * Validates and saves a custom roadmap using the backend builder pattern.
   */
  static async validateAndSave(roadmap: Roadmap): Promise<void> {
    const response = await fetch(`${API_URL}/roadmaps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...roadmap,
        skills: roadmap.skills.map(({ name, category, completed }) => ({
          name,
          category,
          completed,
        })),
        certifications: roadmap.certifications.map(({ name, category, completed }) => ({
          name,
          category,
          completed,
        })),
        weeklyTasks: roadmap.weeklyTasks.map(({ week, title, description, completed }) => ({
          week,
          title,
          description,
          completed,
        })),
        resources: roadmap.resources.map(({ name, type, reference }) => ({
          name,
          type,
          reference,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error("Backend validation failed")
    }
  }
}
