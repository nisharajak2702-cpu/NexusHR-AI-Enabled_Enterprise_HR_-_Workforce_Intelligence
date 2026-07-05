package com.nexushr.nexushr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nexushr.nexushr.entity.Attendance;

import java.time.LocalDate;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	Optional<Attendance> findTopByEmployeeIdOrderByCheckInDesc(Long employeeId);
	Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);
	long countByDate(LocalDate date);
}