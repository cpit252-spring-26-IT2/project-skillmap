package com.skillmap.entity;

import jakarta.persistence.*;

@Entity
@Table(name="weekly_tasks")
public class WeeklyTaskEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private int week;
    private String title;
    @Column(length=1000) private String description;
    private boolean completed;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getWeek() { return week; }
    public void setWeek(int week) { this.week = week; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}