package com.skillmap.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.skillmap.exception.InvalidRoadmapRequestException;

public class CustomRoadmap {

	private final String id;
	private final String title;
	private final String field;
	private final String track;
	private final String targetRole;
	private final List<ChecklistItem> skills;
	private final List<ChecklistItem> certifications;
	private final List<WeeklyTask> weeklyTasks;
	private final List<RoadmapResource> resources;
	private final Instant createdAt;

	private CustomRoadmap(Builder builder) {
		this.id = builder.id;
		this.title = builder.title;
		this.field = builder.field;
		this.track = builder.track;
		this.targetRole = builder.targetRole;
		this.skills = List.copyOf(builder.skills);
		this.certifications = List.copyOf(builder.certifications);
		this.weeklyTasks = List.copyOf(builder.weeklyTasks);
		this.resources = List.copyOf(builder.resources);
		this.createdAt = builder.createdAt;
	}

	public static Builder builder() {
		return new Builder();
	}

	public String id() {
		return id;
	}

	public String title() {
		return title;
	}

	public String field() {
		return field;
	}

	public String track() {
		return track;
	}

	public String targetRole() {
		return targetRole;
	}

	public List<ChecklistItem> skills() {
		return skills;
	}

	public List<ChecklistItem> certifications() {
		return certifications;
	}

	public List<WeeklyTask> weeklyTasks() {
		return weeklyTasks;
	}

	public List<RoadmapResource> resources() {
		return resources;
	}

	public Instant createdAt() {
		return createdAt;
	}

	public int progressPercentage() {
		int totalItems = skills.size() + certifications.size() + weeklyTasks.size();
		if (totalItems == 0) {
			return 0;
		}

		int completedItems = completedCount(skills) + completedTaskCount(weeklyTasks);
		return Math.round((completedItems * 100.0f) / totalItems);
	}

	private int completedCount(List<ChecklistItem> items) {
		return (int) items.stream()
				.filter(ChecklistItem::completed)
				.count();
	}

	private int completedTaskCount(List<WeeklyTask> tasks) {
		return (int) tasks.stream()
				.filter(WeeklyTask::completed)
				.count();
	}

	public static class Builder {

		private String id = UUID.randomUUID().toString();
		private String title;
		private String field;
		private String track;
		private String targetRole;
		private final List<ChecklistItem> skills = new ArrayList<>();
		private final List<ChecklistItem> certifications = new ArrayList<>();
		private final List<WeeklyTask> weeklyTasks = new ArrayList<>();
		private final List<RoadmapResource> resources = new ArrayList<>();
		private Instant createdAt = Instant.now();

		public Builder withId(String id) {
			if (id != null && !id.isBlank()) {
				this.id = id.trim();
			}
			return this;
		}

		public Builder withTitle(String title) {
			this.title = normalizeRequired(title, "Roadmap title is required.");
			return this;
		}

		public Builder withField(String field) {
			this.field = normalizeRequired(field, "Field is required.");
			return this;
		}

		public Builder withTrack(String track) {
			this.track = normalizeRequired(track, "Track is required.");
			return this;
		}

		public Builder withTargetRole(String targetRole) {
			this.targetRole = normalizeRequired(targetRole, "Target role is required.");
			return this;
		}

		public Builder addSkill(ChecklistItem skill) {
			if (skill != null && hasText(skill.name())) {
				this.skills.add(new ChecklistItem(skill.name().trim(), "skill", skill.completed()));
			}
			return this;
		}

		public Builder addCertification(ChecklistItem certification) {
			if (certification != null && hasText(certification.name())) {
				this.certifications.add(new ChecklistItem(
						certification.name().trim(),
						"certification",
						certification.completed()
				));
			}
			return this;
		}

		public Builder addWeeklyTask(WeeklyTask task) {
			if (task != null && task.week() > 0 && hasText(task.title())) {
				this.weeklyTasks.add(new WeeklyTask(
						task.week(),
						task.title().trim(),
						task.description() == null ? "" : task.description().trim(),
						task.completed()
				));
			}
			return this;
		}

		public Builder addResource(RoadmapResource resource) {
			if (resource != null && hasText(resource.name())) {
				this.resources.add(new RoadmapResource(
						resource.name().trim(),
						resource.type() == null ? "resource" : resource.type().trim(),
						resource.reference() == null ? "" : resource.reference().trim()
				));
			}
			return this;
		}

		public CustomRoadmap build() {
			ensureRequired(title, "Roadmap title is required.");
			ensureRequired(field, "Field is required.");
			ensureRequired(track, "Track is required.");
			ensureRequired(targetRole, "Target role is required.");

			if (skills.isEmpty() && certifications.isEmpty() && weeklyTasks.isEmpty()) {
				throw new InvalidRoadmapRequestException(
						"Add at least one skill, certification, or weekly task."
				);
			}

			return new CustomRoadmap(this);
		}

		private static String normalizeRequired(String value, String message) {
			ensureRequired(value, message);
			return value.trim();
		}

		private static void ensureRequired(String value, String message) {
			if (!hasText(value)) {
				throw new InvalidRoadmapRequestException(message);
			}
		}

		private static boolean hasText(String value) {
			return value != null && !value.isBlank();
		}
	}
}
