package com.skillmap.controller;

import com.skillmap.service.RoadmapService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CustomRoadmapControllerTest {

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		CustomRoadmapController controller = new CustomRoadmapController(new RoadmapService());
		this.mockMvc = MockMvcBuilders.standaloneSetup(controller)
				.setControllerAdvice(new GlobalExceptionHandler())
				.build();
	}

	@Test
	void shouldBuildCustomRoadmapFromUserItems() throws Exception {
		String requestBody = """
				{
				  "title": "Backend Developer Plan",
				  "field": "IT",
				  "track": "Software Engineering",
				  "targetRole": "Backend Developer",
				  "skills": [
				    { "name": "Spring Boot", "category": "skill", "completed": true },
				    { "name": "SQL", "category": "skill", "completed": false }
				  ],
				  "certifications": [
				    { "name": "Oracle Java Certification", "category": "certification", "completed": false }
				  ],
				  "weeklyTasks": [
				    {
				      "week": 1,
				      "title": "Build a REST API",
				      "description": "Create CRUD endpoints",
				      "completed": true
				    }
				  ],
				  "resources": [
				    {
				      "name": "Spring guide",
				      "type": "link",
				      "reference": "https://spring.io/guides"
				    }
				  ]
				}
				""";

		mockMvc.perform(post("/roadmaps")
						.contentType(MediaType.APPLICATION_JSON)
						.accept(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Backend Developer Plan"))
				.andExpect(jsonPath("$.skills[0].name").value("Spring Boot"))
				.andExpect(jsonPath("$.weeklyTasks[0].week").value(1))
				.andExpect(jsonPath("$.resources[0].name").value("Spring guide"))
				.andExpect(jsonPath("$.progressPercentage").value(50));
	}

	@Test
	void shouldRejectRoadmapWithoutChecklistItems() throws Exception {
		String requestBody = """
				{
				  "title": "Empty Plan",
				  "field": "IT",
				  "track": "Software Engineering",
				  "targetRole": "Developer",
				  "skills": [],
				  "certifications": [],
				  "weeklyTasks": []
				}
				""";

		mockMvc.perform(post("/roadmaps")
						.contentType(MediaType.APPLICATION_JSON)
						.accept(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Add at least one skill, certification, or weekly task."));
	}
}
