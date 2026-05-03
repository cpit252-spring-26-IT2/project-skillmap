package com.skillmap.controller;

import com.skillmap.model.CustomRoadmapRequest;
import com.skillmap.model.CustomRoadmapResponse;
import com.skillmap.service.RoadmapService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roadmaps")
@CrossOrigin(origins = "*")
public class CustomRoadmapController {

	private final RoadmapService service;

	public CustomRoadmapController(RoadmapService service) {
		this.service = service;
	}

	@PostMapping
	public CustomRoadmapResponse createRoadmap(@RequestBody CustomRoadmapRequest request) {
		return service.createCustomRoadmap(request);
	}
}
