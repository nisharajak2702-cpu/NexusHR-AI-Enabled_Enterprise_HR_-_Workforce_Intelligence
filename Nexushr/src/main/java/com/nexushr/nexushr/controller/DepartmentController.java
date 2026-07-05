package com.nexushr.nexushr.controller;

import com.nexushr.nexushr.entity.Department;
import com.nexushr.nexushr.service.DepartmentService;
import com.nexushr.nexushr.util.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Employee Management",
        description = "Employee CRUD APIs"
)
@RestController
@RequestMapping("/department")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<Department>> add(@RequestBody Department dept) {
        Department saved = departmentService.saveDepartment(dept);
        return ResponseEntity.ok(new ApiResponse<>(true, "Department created successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAll() {
        List<Department> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(new ApiResponse<>(true, "Departments fetched successfully", departments));
    }
}
