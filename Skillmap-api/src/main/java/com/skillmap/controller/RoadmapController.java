package com.skillmap.controller;

import com.skillmap.service.RoadmapService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roadmap")
public class RoadmapController {

	private final RoadmapService service;

	public RoadmapController(RoadmapService service) {
		this.service = service;
	}

	@GetMapping
	public String getRoadmap(@RequestParam String type) {
		return service.generate(type);
	}
}
