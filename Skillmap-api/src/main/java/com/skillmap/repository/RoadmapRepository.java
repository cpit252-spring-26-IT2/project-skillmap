package com.skillmap.repository;

import com.skillmap.entity.RoadmapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapRepository extends JpaRepository<RoadmapEntity, String> {
}