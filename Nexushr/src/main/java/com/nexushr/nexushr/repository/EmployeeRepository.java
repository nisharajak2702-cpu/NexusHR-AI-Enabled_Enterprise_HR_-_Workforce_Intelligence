package com.nexushr.nexushr.repository;

import org.springframework.data.domain.Pageable;	
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nexushr.nexushr.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	Page<Employee> findByFirstNameContainingIgnoreCase(
	        String keyword,
	        Pageable pageable);

	Page<Employee> findByLastNameContainingIgnoreCase(
	        String keyword,
	        Pageable pageable);

	Page<Employee> findByEmailContainingIgnoreCase(
	        String keyword,
	        Pageable pageable);

	Page<Employee> findByPositionContainingIgnoreCase(
	        String keyword,
	        Pageable pageable);
	
	Page<Employee> findByDepartmentId(
	        Long departmentId,
	        Pageable pageable);
}