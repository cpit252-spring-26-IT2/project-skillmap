package com.skillmap.controller;

import com.skillmap.model.RoadmapData;
import com.skillmap.model.RoadmapRequest;
import com.skillmap.service.RoadmapService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roadmap")
@CrossOrigin(origins = "*")
public class RoadmapController {

	private final RoadmapService service;

	public RoadmapController(RoadmapService service) {
		this.service = service;
	}

	@GetMapping
	public RoadmapData getRoadmap(
			@RequestParam String field,
			@RequestParam String track,
			@RequestParam String specialization
	) {
		return service.generate(new RoadmapRequest(field, track, specialization));
	}
}
