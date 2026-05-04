package com.skillmap.model;

import java.util.List;

public class CloudEngRoadmap implements Roadmap {

	@Override
	public RoadmapData generateRoadmap() {
		return new RoadmapData(
				"Cloud Engineer Roadmap",
				"IT",
				"Software Engineering",
				"Cloud Engineering",
				List.of(
						new ChecklistItem("Cloud Fundamentals (AWS/Azure/GCP)", "skill", false),
						new ChecklistItem("Infrastructure as Code (Terraform/CloudFormation)", "skill", false),
						new ChecklistItem("Linux System Administration", "skill", false),
						new ChecklistItem("Containerization (Docker)", "skill", false),
						new ChecklistItem("Orchestration (Kubernetes)", "skill", false),
						new ChecklistItem("Networking (VPC, Subnets, DNS)", "skill", false),
						new ChecklistItem("Security & Compliance", "skill", false),
						new ChecklistItem("Serverless Computing (Lambda/Functions)", "skill", false),
						new ChecklistItem("Monitoring & Logging (CloudWatch/Prometheus)", "skill", false),
						new ChecklistItem("CI/CD for Cloud", "skill", false)
				),
				List.of(
						new ChecklistItem("AWS Certified Solutions Architect - Associate", "certification", false),
						new ChecklistItem("Microsoft Certified: Azure Administrator Associate", "certification", false),
						new ChecklistItem("Google Associate Cloud Engineer", "certification", false)
				),
				List.of(
						new WeeklyTask(1, "Cloud Core", "Learn core services (Compute, Storage, Network) of a major provider.", false),
						new WeeklyTask(2, "Infrastucture as Code", "Provision a multi-tier VPC using Terraform.", false),
						new WeeklyTask(3, "Containers & K8s", "Dockerize an app and deploy it to a managed Kubernetes cluster.", false),
						new WeeklyTask(4, "Serverless & APIs", "Build a serverless backend using AWS Lambda and API Gateway.", false),
						new WeeklyTask(5, "Cloud Security", "Implement IAM roles, security groups, and encryption at rest.", false),
						new WeeklyTask(6, "Full Cloud Deployment", "Set up a complete CI/CD pipeline targeting cloud infrastructure.", false)
				)
		);
	}
}
