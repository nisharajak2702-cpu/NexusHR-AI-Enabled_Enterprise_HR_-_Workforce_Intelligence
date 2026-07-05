package com.nexushr.nexushr.serviceImpl;

import com.nexushr.nexushr.dto.EmployeeDTO;
import com.nexushr.nexushr.entity.Department;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.exception.ResourceNotFoundException;
import com.nexushr.nexushr.repository.DepartmentRepository;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.service.EmployeeService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Employee createEmployee(EmployeeDTO dto) {
        logger.info("Creating employee: {} {}", dto.getFirstName(), dto.getLastName());

        Employee employee = new Employee();
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setHireDate(dto.getHireDate());
        employee.setPhone(dto.getPhone());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + dto.getDepartmentId()));
            employee.setDepartment(dept);
        }

        Employee saved = employeeRepository.save(employee);
        logger.info("Employee created successfully with id: {}", saved.getId());
        return saved;
    }

    @Override
    public Page<Employee> getEmployees(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(page, size, sort);

        return employeeRepository.findAll(pageable);
    }
    
    @Override
    public Page<Employee> searchEmployees(
            String keyword,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return employeeRepository
                .findByFirstNameContainingIgnoreCase(
                        keyword,
                        pageable);
    }
    
    @Override
    public Page<Employee> getEmployeesByDepartment(
            Long departmentId,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return employeeRepository.findByDepartmentId(
                departmentId,
                pageable);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        logger.info("Fetching employee with id: {}", id);
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Override
    public Employee updateEmployee(Long id, EmployeeDTO dto) {
        logger.info("Updating employee with id: {}", id);
        Employee employee = getEmployeeById(id);

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setHireDate(dto.getHireDate());
        employee.setPhone(dto.getPhone());
        employee.setPosition(dto.getPosition());
        employee.setSalary(dto.getSalary());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Department not found with id: " + dto.getDepartmentId()));
            employee.setDepartment(dept);
        }

        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployee(Long id) {
        logger.info("Deleting employee with id: {}", id);
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
}
