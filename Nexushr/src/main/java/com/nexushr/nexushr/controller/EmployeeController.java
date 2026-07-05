package com.nexushr.nexushr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nexushr.nexushr.dto.EmployeeDTO;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.nexushr.nexushr.service.ExcelReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
        name = "Employee Management",
        description = "Employee CRUD APIs"
)

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private ExcelReportService excelReportService;

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody EmployeeDTO dto){

        return ResponseEntity.ok(employeeService.createEmployee(dto));

    }

    @GetMapping
    public ResponseEntity<Page<Employee>> getEmployees(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction) {

        return ResponseEntity.ok(

                employeeService.getEmployees(

                        page,

                        size,

                        sortBy,

                        direction

                )

        );
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Employee>> searchEmployees(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return ResponseEntity.ok(

                employeeService.searchEmployees(

                        keyword,

                        page,

                        size

                )

        );
    }
    
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<Page<Employee>> getByDepartment(

            @PathVariable Long departmentId,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size) {

        return ResponseEntity.ok(

                employeeService.getEmployeesByDepartment(

                        departmentId,

                        page,

                        size

                )

        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id){

        return ResponseEntity.ok(employeeService.getEmployeeById(id));

    }

    @Operation(summary = "Update an existing employee")
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeDTO dto) {

        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));

    }

    @Operation(summary = "Delete an employee")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();

    }
    
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportEmployeeExcel() {

        byte[] excel = excelReportService.generateEmployeeExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=employees.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

}