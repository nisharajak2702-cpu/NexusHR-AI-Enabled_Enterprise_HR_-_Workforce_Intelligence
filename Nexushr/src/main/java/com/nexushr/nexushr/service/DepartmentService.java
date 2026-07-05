package com.nexushr.nexushr.service;

import java.util.List;
import com.nexushr.nexushr.entity.Department;

public interface DepartmentService {
    Department saveDepartment(Department department);
    List<Department> getAllDepartments();
}
