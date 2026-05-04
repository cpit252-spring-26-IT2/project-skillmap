package com.skillmap.model;

import java.util.List;

public class BackendRoadmap implements Roadmap {

	@Override
	public RoadmapData generateRoadmap() {
		return new RoadmapData(
				"Backend Developer Roadmap",
				"IT",
				"Software Engineering",
				"Backend Development",
				List.of(
						new ChecklistItem("Java 17/21 Features", "skill", false),
						new ChecklistItem("Spring Boot 3 (Core, MVC, Security)", "skill", false),
						new ChecklistItem("Hibernate & JPA", "skill", false),
						new ChecklistItem("Relational Databases (PostgreSQL/MySQL)", "skill", false),
						new ChecklistItem("NoSQL (MongoDB/Redis)", "skill", false),
						new ChecklistItem("RESTful API Design", "skill", false),
						new ChecklistItem("Microservices Architecture", "skill", false),
						new ChecklistItem("Docker & Containerization", "skill", false),
						new ChecklistItem("Unit Testing (JUnit, Mockito)", "skill", false),
						new ChecklistItem("CI/CD Pipelines", "skill", false)
				),
				List.of(
						new ChecklistItem("Oracle Certified Professional: Java SE Developer", "certification", false),
						new ChecklistItem("Spring Certified Professional", "certification", false),
						new ChecklistItem("AWS Certified Developer - Associate", "certification", false)
				),
				List.of(
						new WeeklyTask(1, "Language Deep Dive", "Master advanced Java concepts like Streams, Lambdas, and Multithreading.", false),
						new WeeklyTask(2, "Database Mastery", "Design complex schemas and optimize SQL queries.", false),
						new WeeklyTask(3, "Spring Boot Core", "Build a production-ready REST API with Spring Boot.", false),
						new WeeklyTask(4, "Data Persistence", "Implement Hibernate and handle complex mappings.", false),
						new WeeklyTask(5, "Cloud & DevOps", "Containerize the application with Docker and set up a basic CI pipeline.", false),
						new WeeklyTask(6, "Distributed Systems", "Introduce messaging queues (RabbitMQ/Kafka) and basic microservices.", false)
				)
		);
	}
}
