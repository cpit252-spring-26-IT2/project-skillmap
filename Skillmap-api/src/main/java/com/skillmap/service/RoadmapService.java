package com.skillmap.service;

import com.skillmap.factory.RoadmapFactory;
import com.skillmap.model.Roadmap;
import org.springframework.stereotype.Service;

@Service
public class RoadmapService {

	public String generate(String type) {
		Roadmap roadmap = RoadmapFactory.createRoadmap(type);
		return roadmap.generate();
	}
}
