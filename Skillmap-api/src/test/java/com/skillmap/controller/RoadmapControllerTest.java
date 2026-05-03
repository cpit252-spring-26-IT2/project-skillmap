package com.skillmap.controller;

import com.skillmap.facade.RoadmapGenerationFacade;
import com.skillmap.service.RoadmapService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class RoadmapControllerTest {

	private MockMvc mockMvc;

	@BeforeEach
	void setUp() {
		// Update test setup to use the new Facade pattern dependency
		RoadmapGenerationFacade facade = new RoadmapGenerationFacade(new RoadmapService());
		RoadmapController controller = new RoadmapController(facade);
		this.mockMvc = MockMvcBuilders.standaloneSetup(controller)
				.setControllerAdvice(new GlobalExceptionHandler())
				.build();
	}

	@Test
	void shouldReturnMobileRoadmapAsJson() throws Exception {
		mockMvc.perform(get("/roadmap")
						.param("field", "IT")
						.param("track", "Software Engineering")
						.param("specialization", "Mobile")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Mobile Developer Roadmap"))
				.andExpect(jsonPath("$.skills[0].name").value("Java or Kotlin Fundamentals"))
				.andExpect(jsonPath("$.certifications[0].completed").value(false));
	}

	@Test
	void shouldReturnBadRequestForInvalidSpecialization() throws Exception {
		mockMvc.perform(get("/roadmap")
						.param("field", "IT")
						.param("track", "Software Engineering")
						.param("specialization", "DevOps")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Invalid specialization. Choose Frontend, Backend, or Mobile."));
	}
}
