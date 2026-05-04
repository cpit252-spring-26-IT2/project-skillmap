package com.skillmap.model;

import java.util.List;

public class CybersecurityRoadmap implements Roadmap {

	@Override
	public RoadmapData generateRoadmap() {
		return new RoadmapData(
				"Cybersecurity Roadmap",
				"IT",
				"Software Engineering",
				"Cybersecurity",
				List.of(
						new ChecklistItem("Network Security Basics", "skill", false),
						new ChecklistItem("Linux & Windows Security", "skill", false),
						new ChecklistItem("Ethical Hacking & Pentesting", "skill", false),
						new ChecklistItem("Web Application Security (OWASP Top 10)", "skill", false),
						new ChecklistItem("Cryptography & Encryption", "skill", false),
						new ChecklistItem("Incident Response & Forensics", "skill", false),
						new ChecklistItem("Threat Intelligence", "skill", false),
						new ChecklistItem("Security Auditing & Compliance", "skill", false),
						new ChecklistItem("SIEM Tools (Splunk/ELK)", "skill", false),
						new ChecklistItem("Python for Security", "skill", false)
				),
				List.of(
						new ChecklistItem("CompTIA Security+", "certification", false),
						new ChecklistItem("Certified Ethical Hacker (CEH)", "certification", false),
						new ChecklistItem("Certified Information Systems Security Professional (CISSP)", "certification", false)
				),
				List.of(
						new WeeklyTask(1, "Networking & OS Security", "Master network protocols and secure OS configurations.", false),
						new WeeklyTask(2, "Offensive Security", "Learn reconnaissance and basic penetration testing techniques.", false),
						new WeeklyTask(3, "Web & App Security", "Audit a web application for common vulnerabilities.", false),
						new WeeklyTask(4, "Defensive Security", "Implement firewalls, IDS/IPS, and endpoint protection.", false),
						new WeeklyTask(5, "Cryptography", "Learn to implement secure communication and data encryption.", false),
						new WeeklyTask(6, "Security Operations", "Set up a SIEM for log analysis and incident monitoring.", false)
				)
		);
	}
}
