package com.nexushr.nexushr.serviceImpl;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nexushr.nexushr.dto.DashboardDTO;
import com.nexushr.nexushr.repository.AttendanceRepository;
import com.nexushr.nexushr.repository.DepartmentRepository;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.repository.LeaveRepository;
import com.nexushr.nexushr.repository.PayrollRepository;
import com.nexushr.nexushr.repository.PerformanceRepository;
import com.nexushr.nexushr.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {
	
	@Override
	public DashboardDTO getDashboard() {

	    DashboardDTO dto = new DashboardDTO();

	    dto.setTotalEmployees(employeeRepository.count());

	    dto.setTotalDepartments(departmentRepository.count());

	    dto.setPresentToday(
	            attendanceRepository.countByDate(LocalDate.now()));
	    
	    dto.setAbsentToday(
	            dto.getTotalEmployees() - dto.getPresentToday());

	    dto.setPendingLeaves(
	            leaveRepository.countByLeaveStatus("PENDING"));
	    
	    Double avg = performanceRepository.getAverageRating();

	    dto.setPayrollGenerated(payrollRepository.count());

	    dto.setAveragePerformance(avg == null ? 0.0 : avg);

	    return dto;
	}

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private AttendanceRepository attendanceRepository;

	@Autowired
	private LeaveRepository leaveRepository;

	@Autowired
	private PayrollRepository payrollRepository;

	@Autowired
	private PerformanceRepository performanceRepository;
}