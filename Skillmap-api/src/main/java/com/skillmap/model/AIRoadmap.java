package com.skillmap.model;

import java.util.List;

public class AIRoadmap implements Roadmap {

	@Override
	public RoadmapData generateRoadmap() {
		return new RoadmapData(
				"AI & Machine Learning Roadmap",
				"IT",
				"Software Engineering",
				"AI Development",
				List.of(
						new ChecklistItem("Mathematics (Linear Algebra, Calculus, Stats)", "skill", false),
						new ChecklistItem("Python for Data Science", "skill", false),
						new ChecklistItem("NumPy, Pandas, Matplotlib", "skill", false),
						new ChecklistItem("Scikit-Learn (Supervised/Unsupervised)", "skill", false),
						new ChecklistItem("Neural Networks & Deep Learning", "skill", false),
						new ChecklistItem("PyTorch or TensorFlow", "skill", false),
						new ChecklistItem("Natural Language Processing (NLP)", "skill", false),
						new ChecklistItem("Computer Vision", "skill", false),
						new ChecklistItem("MLOps Basics", "skill", false),
						new ChecklistItem("Model Deployment (FastAPI/Flask)", "skill", false)
				),
				List.of(
						new ChecklistItem("Google Professional Machine Learning Engineer", "certification", false),
						new ChecklistItem("DeepLearning.AI TensorFlow Developer", "certification", false),
						new ChecklistItem("AWS Certified Machine Learning - Specialty", "certification", false)
				),
				List.of(
						new WeeklyTask(1, "Data Analysis Foundation", "Master data manipulation with Pandas and NumPy.", false),
						new WeeklyTask(2, "Classical Machine Learning", "Implement regression, classification, and clustering algorithms.", false),
						new WeeklyTask(3, "Deep Learning Intro", "Understand perceptrons and build your first neural network.", false),
						new WeeklyTask(4, "Advanced Frameworks", "Deep dive into PyTorch/TensorFlow for model training.", false),
						new WeeklyTask(5, "Specialized AI", "Explore NLP (Transformers) or Computer Vision (CNNs).", false),
						new WeeklyTask(6, "Deployment & MLOps", "Deploy a model as an API and set up monitoring.", false)
				)
		);
	}
}
