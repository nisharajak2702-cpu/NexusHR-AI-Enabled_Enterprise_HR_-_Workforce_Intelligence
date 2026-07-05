package com.nexushr.nexushr.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import com.nexushr.nexushr.dto.PerformanceDTO;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.entity.PerformanceReview;
import com.nexushr.nexushr.exception.ResourceNotFoundException;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.repository.PerformanceRepository;
import com.nexushr.nexushr.service.PerformanceService;


@Service
public class PerformanceServiceImpl
        implements PerformanceService {
	
	@Autowired
	private PerformanceRepository performanceRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Override
	public PerformanceReview createReview(PerformanceDTO dto) {

	    Employee employee = employeeRepository.findById(dto.getEmployeeId())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Employee not found with id: " + dto.getEmployeeId()));

	    PerformanceReview review = new PerformanceReview();
	    return performanceRepository.save(populateReview(review, dto, employee));
	}

	@Override
	public PerformanceReview updateReview(Long id, PerformanceDTO dto) {
	    PerformanceReview review = performanceRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Performance review not found with id: " + id));

	    Employee employee = employeeRepository.findById(dto.getEmployeeId())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Employee not found with id: " + dto.getEmployeeId()));

	    return performanceRepository.save(populateReview(review, dto, employee));
	}

	private PerformanceReview populateReview(PerformanceReview review, PerformanceDTO dto, Employee employee) {
	    review.setEmployee(employee);
	    review.setReviewPeriod(dto.getReviewPeriod());
	    review.setReviewer(dto.getReviewer());
	    review.setTechnicalSkill(dto.getTechnicalSkill());
	    review.setCommunication(dto.getCommunication());
	    review.setTeamwork(dto.getTeamwork());
	    review.setPunctuality(dto.getPunctuality());
	    review.setProblemSolving(dto.getProblemSolving());
	    review.setLeadership(dto.getLeadership());
	    review.setRemarks(dto.getRemarks());
	    if (review.getReviewDate() == null) {
	        review.setReviewDate(LocalDate.now());
	    }

	    double overall =
	            (
	                    dto.getTechnicalSkill()
	                    + dto.getCommunication()
	                    + dto.getTeamwork()
	                    + dto.getPunctuality()
	                    + dto.getProblemSolving()
	                    + dto.getLeadership()
	            ) / 6.0;

	    review.setOverallRating(overall);
	    return review;
	}

	    @Override
	    public PerformanceReview getReview(Long id) {
		return performanceRepository.findById(id)
			        .orElseThrow(() -> new ResourceNotFoundException("Performance review not found with id: " + id));
	    }

	    @Override
	    public List<PerformanceReview> getAllReviews1() {

	        return performanceRepository.findAll();

	    }

	    @Override
	    public List<PerformanceReview> getAllReviews() {

	        return performanceRepository.findAll();

	    }

	    @Override
	    public void deleteReview(Long id) {
			PerformanceReview review = getReview(id);
			performanceRepository.delete(review);
	    }

		@Override
		public List<PerformanceReview> getEmployeeReviews(Long employeeId) {
			return performanceRepository.findByEmployee_Id(employeeId);
		}

}