package com.skillmap.model;

public record WeeklyTask(
		int week,
		String title,
		String description,
		boolean completed
) {
}
