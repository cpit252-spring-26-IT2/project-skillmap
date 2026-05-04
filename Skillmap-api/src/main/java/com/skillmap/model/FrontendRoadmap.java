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
						new ChecklistItem("HTML5 & Semantic HTML", "skill", false),
						new ChecklistItem("CSS3 (Flexbox, Grid, Animations)", "skill", false),
						new ChecklistItem("Modern JavaScript (ES6+)", "skill", false),
						new ChecklistItem("TypeScript", "skill", false),
						new ChecklistItem("React.js & State Management", "skill", false),
						new ChecklistItem("Next.js Framework", "skill", false),
						new ChecklistItem("Tailwind CSS", "skill", false),
						new ChecklistItem("Browser DevTools & Debugging", "skill", false),
						new ChecklistItem("Git and GitHub", "skill", false),
						new ChecklistItem("Web Security Basics (CORS, CSP)", "skill", false)
				),
				List.of(
						new ChecklistItem("Meta Front-End Developer Professional Certificate", "certification", false),
						new ChecklistItem("freeCodeCamp Responsive Web Design", "certification", false),
						new ChecklistItem("Google UX Design Professional Certificate", "certification", false)
				),
				List.of(
						new WeeklyTask(1, "The Fundamentals", "Master Semantic HTML and advanced CSS layouts (Flex/Grid).", false),
						new WeeklyTask(2, "JavaScript Mastery", "Deep dive into ES6+, Promises, and Fetch API.", false),
						new WeeklyTask(3, "React Core", "Learn hooks, components, and props in React.", false),
						new WeeklyTask(4, "State & Routing", "Implement Redux/Zustand and React Router.", false),
						new WeeklyTask(5, "Modern Frameworks", "Move to Next.js and understand SSR/SSG.", false),
						new WeeklyTask(6, "Capstone Project", "Build a fully responsive portfolio with Next.js and Tailwind.", false)
				)
		);
	}
}
