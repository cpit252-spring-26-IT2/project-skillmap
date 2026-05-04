package com.skillmap.factory;

import com.skillmap.model.AIRoadmap;
import com.skillmap.model.BackendRoadmap;
import com.skillmap.model.CloudEngRoadmap;
import com.skillmap.model.CybersecurityRoadmap;
import com.skillmap.model.FrontendRoadmap;
import com.skillmap.model.MobileRoadmap;
import com.skillmap.model.Roadmap;
import com.skillmap.model.RoadmapRequest;
import com.skillmap.exception.InvalidRoadmapRequestException;

public class RoadmapFactory {

	private RoadmapFactory() {
	}

	public static Roadmap createRoadmap(RoadmapRequest request) {
		String field = normalize(request.field());
		String track = normalize(request.track());
		String specialization = normalize(request.specialization());

		if (!"it".equals(field) || !"software engineering".equals(track)) {
			throw new InvalidRoadmapRequestException(
					"Only IT -> Software Engineering roadmaps are available in this stage."
			);
		}

		return switch (specialization) {
			case "frontend", "frontend development" -> new FrontendRoadmap();
			case "backend", "backend development" -> new BackendRoadmap();
			case "mobile", "mobile development", "mobile programmer" -> new MobileRoadmap();
			case "ai", "artificial intelligence", "machine learning" -> new AIRoadmap();
			case "cloud", "cloud engineering", "cloud infrastructure" -> new CloudEngRoadmap();
			case "cybersecurity", "security", "cyber security" -> new CybersecurityRoadmap();
			default -> throw new InvalidRoadmapRequestException(
					"Invalid specialization. Choose Frontend, Backend, Mobile, AI, Cloud Engineering, or Cybersecurity."
			);
		};
	}

	private static String normalize(String value) {
		if (value == null || value.isBlank()) {
			throw new InvalidRoadmapRequestException("Field, track, and specialization are required.");
		}
		return value.trim().toLowerCase();
	}
}
