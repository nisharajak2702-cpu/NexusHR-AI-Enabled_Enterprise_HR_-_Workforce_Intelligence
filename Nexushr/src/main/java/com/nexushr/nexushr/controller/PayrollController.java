package com.nexushr.nexushr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nexushr.nexushr.dto.PayrollDTO;
import com.nexushr.nexushr.entity.Payroll;
import com.nexushr.nexushr.service.PayrollPdfService;
import com.nexushr.nexushr.service.PayrollService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.nexushr.nexushr.service.ExcelReportService;
 
@Tag(
        name = "Employee Management",
        description = "Employee CRUD APIs"
)
@RestController
@RequestMapping("/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private PayrollPdfService payrollPdfService;
    
    @Autowired
    private ExcelReportService excelReportService;
    
    // Generate Payroll
    @PostMapping("/generate")
    public ResponseEntity<Payroll> generatePayroll(@RequestBody PayrollDTO dto) {

        return ResponseEntity.ok(payrollService.generatePayroll(dto));

    }

    // Get All Payrolls
    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayrolls() {

        return ResponseEntity.ok(payrollService.getAllPayrolls());

    }

    // Get Payroll By ID
    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable Long id) {

        return ResponseEntity.ok(payrollService.getPayrollById(id));

    }

    // Get Payroll By Employee
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getEmployeePayroll(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getPayrollByEmployee(employeeId));

    }

    // Delete Payroll
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayroll(@PathVariable Long id) {

        payrollService.deletePayroll(id);

        return ResponseEntity.ok("Payroll Deleted Successfully");
    }
    @GetMapping("/payslip/{id}")
    public ResponseEntity<byte[]> downloadPayslip(
            @PathVariable Long id) {

        byte[] pdf = payrollPdfService.generatePayslip(id);

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=payslip.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
    
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportPayrollExcel() {

        byte[] excel =
                excelReportService.generatePayrollExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=payroll.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    
}