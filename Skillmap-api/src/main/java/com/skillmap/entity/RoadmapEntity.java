package com.skillmap.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name="roadmaps")
public class RoadmapEntity {
    @Id private String id;
    private String title;
    private String field;
    private String track;
    private String targetRole;
    private Instant createdAt;
    
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name="roadmap_id")
    private List<ChecklistItemEntity> skills=new ArrayList<>();
    
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name="roadmap_id")
    private List<ChecklistItemEntity> certifications=new ArrayList<>();
    
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name="roadmap_id")
    private List<WeeklyTaskEntity> weeklyTasks=new ArrayList<>();
    
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name="roadmap_id")
    private List<ResourceEntity> resources=new ArrayList<>();
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getField() { return field; }
    public void setField(String field) { this.field = field; }
    public String getTrack() { return track; }
    public void setTrack(String track) { this.track = track; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<ChecklistItemEntity> getSkills() { return skills; }
    public void setSkills(List<ChecklistItemEntity> skills) { this.skills = skills; }
    public List<ChecklistItemEntity> getCertifications() { return certifications; }
    public void setCertifications(List<ChecklistItemEntity> certifications) { this.certifications = certifications; }
    public List<WeeklyTaskEntity> getWeeklyTasks() { return weeklyTasks; }
    public void setWeeklyTasks(List<WeeklyTaskEntity> weeklyTasks) { this.weeklyTasks = weeklyTasks; }
    public List<ResourceEntity> getResources() { return resources; }
    public void setResources(List<ResourceEntity> resources) { this.resources = resources; }
}