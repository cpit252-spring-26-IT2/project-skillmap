package com.skillmap.service;

import com.skillmap.factory.RoadmapFactory;
import com.skillmap.model.Roadmap;
import com.skillmap.model.RoadmapData;
import com.skillmap.model.RoadmapRequest;
import org.springframework.stereotype.Service;

@Service
public class RoadmapService {

	public RoadmapData generate(RoadmapRequest request) {
		Roadmap roadmap = RoadmapFactory.createRoadmap(request);
		return roadmap.generateRoadmap();
	}
}
