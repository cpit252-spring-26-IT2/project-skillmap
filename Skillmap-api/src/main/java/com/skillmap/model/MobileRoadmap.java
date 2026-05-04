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
						new ChecklistItem("Kotlin (Android) or Swift (iOS)", "skill", false),
						new ChecklistItem("Mobile UI/UX Design Principles", "skill", false),
						new ChecklistItem("Jetpack Compose or SwiftUI", "skill", false),
						new ChecklistItem("Local Storage (Room/CoreData)", "skill", false),
						new ChecklistItem("Networking (Retrofit/URLSession)", "skill", false),
						new ChecklistItem("Architecture Patterns (MVVM/MVI)", "skill", false),
						new ChecklistItem("Firebase Services", "skill", false),
						new ChecklistItem("Dependency Injection (Hilt/Koin)", "skill", false),
						new ChecklistItem("App Store & Play Store Guidelines", "skill", false),
						new ChecklistItem("Unit & UI Testing", "skill", false)
				),
				List.of(
						new ChecklistItem("Google Associate Android Developer", "certification", false),
						new ChecklistItem("Meta Android Developer Professional Certificate", "certification", false),
						new ChecklistItem("Apple App Development with Swift", "certification", false)
				),
				List.of(
						new WeeklyTask(1, "Native Language Mastery", "Deep dive into Kotlin or Swift fundamentals.", false),
						new WeeklyTask(2, "Modern UI Development", "Build interactive layouts using Jetpack Compose or SwiftUI.", false),
						new WeeklyTask(3, "Navigation & State", "Implement complex navigation flows and state management.", false),
						new WeeklyTask(4, "Data & Networking", "Integrate REST APIs and implement local caching.", false),
						new WeeklyTask(5, "Advanced Architecture", "Refactor the app using MVVM and Dependency Injection.", false),
						new WeeklyTask(6, "Launch Preparation", "Optimize performance, fix bugs, and prepare for store submission.", false)
				)
		);
	}
}
