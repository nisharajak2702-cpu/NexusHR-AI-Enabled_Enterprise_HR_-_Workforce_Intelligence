package com.nexushr.nexushr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nexushr.nexushr.entity.Payroll;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {

	Optional<Payroll> findByEmployeeIdAndMonthAndYear(
            Long employeeId,
            String month,
            Integer year);

	List<Payroll> findByEmployeeId(Long employeeId);

    
}

