package com.nexushr.nexushr.service;

import java.util.List;
import com.nexushr.nexushr.dto.LeaveDTO;
import com.nexushr.nexushr.entity.LeaveRequest;

public interface LeaveService {
    LeaveRequest applyLeave(LeaveDTO dto);
    LeaveRequest approveLeave(Long id);
    LeaveRequest rejectLeave(Long id);
    List<LeaveRequest> getAllLeaves();
    List<LeaveRequest> getLeavesByEmployee(Long empId);
}
