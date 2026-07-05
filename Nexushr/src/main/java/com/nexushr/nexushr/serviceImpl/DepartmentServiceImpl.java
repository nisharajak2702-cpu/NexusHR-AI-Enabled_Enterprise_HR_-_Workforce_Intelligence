package com.nexushr.nexushr.serviceImpl;

import com.nexushr.nexushr.entity.Department;
import com.nexushr.nexushr.repository.DepartmentRepository;
import com.nexushr.nexushr.service.DepartmentService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentServiceImpl.class);

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Department saveDepartment(Department department) {
        logger.info("Saving department: {}", department.getName());
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> getAllDepartments() {
        logger.info("Fetching all departments");
        return departmentRepository.findAll();
    }
}
