package com.nexushr.nexushr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import com.nexushr.nexushr.entity.PerformanceReview;

public interface PerformanceRepository
extends JpaRepository<PerformanceReview, Long> {

List<PerformanceReview> findByEmployee_Id(Long employeeId);

@Query("""
	       SELECT AVG(p.overallRating)
	       FROM PerformanceReview p
	       """)
	Double getAverageRating();

}