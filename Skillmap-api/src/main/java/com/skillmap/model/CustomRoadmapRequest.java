package com.skillmap.model;

import java.util.List;

public record CustomRoadmapRequest(
		String id,
		String title,
		String field,
		String track,
		String targetRole,
		List<ChecklistItem> skills,
		List<ChecklistItem> certifications,
		List<WeeklyTask> weeklyTasks,
		List<RoadmapResource> resources
) {
}
