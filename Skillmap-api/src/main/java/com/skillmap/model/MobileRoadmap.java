package com.skillmap.model;

import java.util.List;

public class MobileRoadmap implements Roadmap {

	@Override
	public RoadmapData generateRoadmap() {
		return new RoadmapData(
				"Mobile Developer Roadmap",
				"IT",
				"Software Engineering",
				"Mobile Development",
				List.of(
						new ChecklistItem("Java or Kotlin Fundamentals", "skill", false),
						new ChecklistItem("Object-Oriented Programming", "skill", false),
						new ChecklistItem("Android Studio", "skill", false),
						new ChecklistItem("Mobile UI Design Basics", "skill", false),
						new ChecklistItem("Firebase or SQLite", "skill", false),
						new ChecklistItem("REST API Integration", "skill", false)
				),
				List.of(
						new ChecklistItem("Android App Development Certificate", "certification", false),
						new ChecklistItem("Kotlin for Android Certificate", "certification", false)
				)
		);
	}
}
