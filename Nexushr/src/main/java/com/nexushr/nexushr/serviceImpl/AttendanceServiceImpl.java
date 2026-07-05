package com.nexushr.nexushr.serviceImpl;

import com.nexushr.nexushr.entity.Attendance;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.exception.ResourceNotFoundException;
import com.nexushr.nexushr.repository.AttendanceRepository;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.service.AttendanceService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceServiceImpl.class);

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Attendance checkIn(Long employeeId) {
        logger.info("Check-in requested for employee id: {}", employeeId);

        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeIdAndDate(employeeId, today);

        if (existing.isPresent()) {
            throw new IllegalStateException("Employee " + employeeId + " has already checked in today.");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(emp);
        attendance.setDate(today);
        attendance.setCheckIn(LocalDateTime.now());
        attendance.setStatus("PRESENT");

        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance checkOut(Long employeeId) {
        logger.info("Check-out requested for employee id: {}", employeeId);

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No check-in found for employee " + employeeId + " today."));

        if (attendance.getCheckOut() != null) {
            throw new IllegalStateException("Employee " + employeeId + " has already checked out today.");
        }

        attendance.setCheckOut(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAllAttendance() {
        logger.info("Fetching all attendance records");
        return attendanceRepository.findAll();
    }
}
