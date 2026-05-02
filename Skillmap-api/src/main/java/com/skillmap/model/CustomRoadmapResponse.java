package com.skillmap.model;

import java.time.Instant;
import java.util.List;

public record CustomRoadmapResponse(
		String id,
		String title,
		String field,
		String track,
		String targetRole,
		List<ChecklistItem> skills,
		List<ChecklistItem> certifications,
		List<WeeklyTask> weeklyTasks,
		List<RoadmapResource> resources,
		int progressPercentage,
		Instant createdAt
) {
	public static CustomRoadmapResponse from(CustomRoadmap roadmap) {
		return new CustomRoadmapResponse(
				roadmap.id(),
				roadmap.title(),
				roadmap.field(),
				roadmap.track(),
				roadmap.targetRole(),
				roadmap.skills(),
				roadmap.certifications(),
				roadmap.weeklyTasks(),
				roadmap.resources(),
				roadmap.progressPercentage(),
				roadmap.createdAt()
		);
	}
}
