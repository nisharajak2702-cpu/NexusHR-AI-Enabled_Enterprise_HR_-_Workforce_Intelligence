package com.nexushr.nexushr.service;

import org.springframework.data.domain.Page;

import com.nexushr.nexushr.dto.EmployeeDTO;
import com.nexushr.nexushr.entity.Employee;

public interface EmployeeService {

    Employee createEmployee(EmployeeDTO dto);

    Page<Employee> getEmployees(int page,
                                int size,
                                String sortBy,
                                String direction);

    Page<Employee> searchEmployees(String keyword,
                                   int page,
                                   int size);

    Page<Employee> getEmployeesByDepartment(Long departmentId,
                                            int page,
                                            int size);

    Employee getEmployeeById(Long id);

    Employee updateEmployee(Long id,
                            EmployeeDTO dto);

    void deleteEmployee(Long id);
}