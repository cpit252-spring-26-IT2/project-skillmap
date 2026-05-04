package com.skillmap.model;

import java.util.List;

public record RoadmapData(
		String title,
		String field,
		String track,
		String specialization,
		List<ChecklistItem> skills,
		List<ChecklistItem> certifications,
		List<WeeklyTask> weeklyTasks
) {
}
