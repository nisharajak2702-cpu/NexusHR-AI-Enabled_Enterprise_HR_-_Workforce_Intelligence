package com.nexushr.nexushr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nexushr.nexushr.entity.LeaveRequest;

import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeId(Long employeeId);
    
    long countByLeaveStatus(String leaveStatus);
}