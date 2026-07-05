package com.nexushr.nexushr.serviceImpl;

import com.nexushr.nexushr.dto.LeaveDTO;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.entity.LeaveRequest;
import com.nexushr.nexushr.exception.ResourceNotFoundException;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.repository.LeaveRepository;
import com.nexushr.nexushr.service.LeaveService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    private static final Logger logger = LoggerFactory.getLogger(LeaveServiceImpl.class);

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public LeaveRequest applyLeave(LeaveDTO dto) {
        logger.info("Leave application received for employee id: {}", dto.getEmployeeId());

        Employee emp = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + dto.getEmployeeId()));

        LeaveRequest leave = new LeaveRequest();
        leave.setEmployee(emp);
        leave.setFromDate(LocalDate.parse(dto.getFromDate()));
        leave.setToDate(LocalDate.parse(dto.getToDate()));
        leave.setReason(dto.getReason());
        leave.setStatus("PENDING");

        return leaveRepository.save(leave);
    }

    @Override
    public LeaveRequest approveLeave(Long id) {
        logger.info("Approving leave id: {}", id);
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        leave.setStatus("APPROVED");
        return leaveRepository.save(leave);
    }

    @Override
    public LeaveRequest rejectLeave(Long id) {
        logger.info("Rejecting leave id: {}", id);
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        leave.setStatus("REJECTED");
        return leaveRepository.save(leave);
    }

    @Override
    public List<LeaveRequest> getAllLeaves() {
        logger.info("Fetching all leave requests");
        return leaveRepository.findAll();
    }

    @Override
    public List<LeaveRequest> getLeavesByEmployee(Long empId) {
        logger.info("Fetching leaves for employee id: {}", empId);
        return leaveRepository.findByEmployeeId(empId);
    }
}
