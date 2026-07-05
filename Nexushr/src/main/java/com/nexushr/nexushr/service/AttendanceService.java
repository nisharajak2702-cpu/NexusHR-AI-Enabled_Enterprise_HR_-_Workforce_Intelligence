package com.nexushr.nexushr.service;

import java.util.List;
import com.nexushr.nexushr.entity.Attendance;

public interface AttendanceService {
    Attendance checkIn(Long employeeId);
    Attendance checkOut(Long employeeId);
    List<Attendance> getAllAttendance();
}
