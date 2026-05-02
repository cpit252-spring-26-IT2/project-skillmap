package com.skillmap.service;

import com.skillmap.factory.RoadmapFactory;
import com.skillmap.model.ChecklistItem;
import com.skillmap.model.CustomRoadmap;
import com.skillmap.model.CustomRoadmapRequest;
import com.skillmap.model.CustomRoadmapResponse;
import com.skillmap.model.Roadmap;
import com.skillmap.model.RoadmapData;
import com.skillmap.model.RoadmapResource;
import com.skillmap.model.RoadmapRequest;
import com.skillmap.model.WeeklyTask;
import org.springframework.stereotype.Service;

@Service
public class RoadmapService {

	public RoadmapData generate(RoadmapRequest request) {
		Roadmap roadmap = RoadmapFactory.createRoadmap(request);
		return roadmap.generateRoadmap();
	}

	public CustomRoadmapResponse createCustomRoadmap(CustomRoadmapRequest request) {
		CustomRoadmap.Builder builder = CustomRoadmap.builder()
				.withId(request.id())
				.withTitle(request.title())
				.withField(request.field())
				.withTrack(request.track())
				.withTargetRole(request.targetRole());

		if (request.skills() != null) {
			for (ChecklistItem skill : request.skills()) {
				builder.addSkill(skill);
			}
		}

		if (request.certifications() != null) {
			for (ChecklistItem certification : request.certifications()) {
				builder.addCertification(certification);
			}
		}

		if (request.weeklyTasks() != null) {
			for (WeeklyTask task : request.weeklyTasks()) {
				builder.addWeeklyTask(task);
			}
		}

		if (request.resources() != null) {
			for (RoadmapResource resource : request.resources()) {
				builder.addResource(resource);
			}
		}

		return CustomRoadmapResponse.from(builder.build());
	}
}
