package com.skillmap.model;

import java.util.List;

public class FrontendRoadmap implements Roadmap {

	@Override
	public RoadmapData generateRoadmap() {
		return new RoadmapData(
				"Frontend Developer Roadmap",
				"IT",
				"Software Engineering",
				"Frontend Development",
				List.of(
						new ChecklistItem("HTML", "skill", false),
						new ChecklistItem("CSS", "skill", false),
						new ChecklistItem("JavaScript", "skill", false),
						new ChecklistItem("Responsive Design", "skill", false),
						new ChecklistItem("React", "skill", false),
						new ChecklistItem("Git and GitHub", "skill", false)
				),
				List.of(
						new ChecklistItem("Meta Front-End Developer Certificate", "certification", false),
						new ChecklistItem("Responsive Web Design Certification", "certification", false)
				)
		);
	}
}
