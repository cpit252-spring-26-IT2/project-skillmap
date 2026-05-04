package com.skillmap.entity;

import jakarta.persistence.*;

@Entity
@Table(name="resources")
public class ResourceEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name;
    private String type;
    @Column(length=1000) private String reference;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
}