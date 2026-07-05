package com.nexushr.nexushr.service;

import java.util.List;
import com.nexushr.nexushr.dto.PerformanceDTO;
import com.nexushr.nexushr.entity.PerformanceReview;

public interface PerformanceService {

    PerformanceReview createReview(PerformanceDTO dto);

    PerformanceReview updateReview(Long id, PerformanceDTO dto);

    PerformanceReview getReview(Long id);

    List<PerformanceReview> getAllReviews();

    List<PerformanceReview> getEmployeeReviews(Long employeeId);

    void deleteReview(Long id);

	List<PerformanceReview> getAllReviews1();

}