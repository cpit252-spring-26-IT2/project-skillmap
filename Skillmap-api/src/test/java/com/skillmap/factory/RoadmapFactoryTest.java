package com.skillmap.factory;

import com.skillmap.exception.InvalidRoadmapRequestException;
import com.skillmap.model.BackendRoadmap;
import com.skillmap.model.FrontendRoadmap;
import com.skillmap.model.MobileRoadmap;
import com.skillmap.model.Roadmap;
import com.skillmap.model.RoadmapRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;

class RoadmapFactoryTest {

	@Test
	void shouldCreateFrontendRoadmap() {
		Roadmap roadmap = RoadmapFactory.createRoadmap(
				new RoadmapRequest("IT", "Software Engineering", "Frontend")
		);

		assertInstanceOf(FrontendRoadmap.class, roadmap);
	}

	@Test
	void shouldCreateBackendRoadmap() {
		Roadmap roadmap = RoadmapFactory.createRoadmap(
				new RoadmapRequest("IT", "Software Engineering", "Backend")
		);

		assertInstanceOf(BackendRoadmap.class, roadmap);
	}

	@Test
	void shouldCreateMobileRoadmap() {
		Roadmap roadmap = RoadmapFactory.createRoadmap(
				new RoadmapRequest("IT", "Software Engineering", "Mobile Programmer")
		);

		assertInstanceOf(MobileRoadmap.class, roadmap);
	}

	@Test
	void shouldRejectInvalidSpecialization() {
		assertThrows(
				InvalidRoadmapRequestException.class,
				() -> RoadmapFactory.createRoadmap(
						new RoadmapRequest("IT", "Software Engineering", "DevOps")
				)
		);
	}
}
