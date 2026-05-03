package com.skillmap.controller;

import com.skillmap.facade.RoadmapGenerationFacade;
import com.skillmap.model.RoadmapData;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roadmap")
@CrossOrigin(origins = "*")
public class RoadmapController {

	private final RoadmapGenerationFacade facade;

	public RoadmapController(RoadmapGenerationFacade facade) {
		this.facade = facade;
	}

	@GetMapping
	public RoadmapData getRoadmap(
			@RequestParam String field,
			@RequestParam String track,
			@RequestParam String specialization
	) {
		// The controller now delegates to the Facade instead of knowing about the Service and Request models
		return facade.generateVerifiedTemplate(field, track, specialization);
	}
}
