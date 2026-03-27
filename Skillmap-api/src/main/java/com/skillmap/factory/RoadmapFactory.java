package com.skillmap.factory;

import com.skillmap.model.BackendRoadmap;
import com.skillmap.model.FrontendRoadmap;
import com.skillmap.model.Roadmap;

public class RoadmapFactory {

	public static Roadmap createRoadmap(String type) {
		switch (type.toLowerCase()) {
			case "frontend":
				return new FrontendRoadmap();
			case "backend":
				return new BackendRoadmap();
			default:
				throw new IllegalArgumentException("Invalid type");
		}
	}
}
