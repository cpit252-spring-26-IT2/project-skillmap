package com.skillmap.model;

import java.util.List;

public class BackendRoadmap implements Roadmap {

	@Override
	public RoadmapData generateRoadmap() {
		return new RoadmapData(
				"Backend Developer Roadmap",
				"IT",
				"Software Engineering",
				"Backend Development",
				List.of(
						new ChecklistItem("Java Fundamentals", "skill", false),
						new ChecklistItem("Object-Oriented Programming", "skill", false),
						new ChecklistItem("Spring Boot", "skill", false),
						new ChecklistItem("REST API Development", "skill", false),
						new ChecklistItem("SQL and Database Design", "skill", false),
						new ChecklistItem("Git and GitHub", "skill", false)
				),
				List.of(
						new ChecklistItem("Oracle Java Certification", "certification", false),
						new ChecklistItem("Spring Framework Certification Course", "certification", false)
				)
		);
	}
}
