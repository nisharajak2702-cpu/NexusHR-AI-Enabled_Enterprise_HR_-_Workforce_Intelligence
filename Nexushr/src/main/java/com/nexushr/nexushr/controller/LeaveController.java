package com.nexushr.nexushr.controller;

import com.nexushr.nexushr.dto.LeaveDTO;
import com.nexushr.nexushr.entity.LeaveRequest;
import com.nexushr.nexushr.service.LeaveService;
import com.nexushr.nexushr.util.ApiResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
@RequestMapping("/leave")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;
    
    @Autowired
    private ExcelReportService excelReportService;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<LeaveRequest>> applyLeave(@RequestBody LeaveDTO dto) {
        LeaveRequest leave = leaveService.applyLeave(dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Leave applied successfully", leave));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse<LeaveRequest>> approveLeave(@PathVariable Long id) {
        LeaveRequest leave = leaveService.approveLeave(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Leave approved successfully", leave));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<ApiResponse<LeaveRequest>> rejectLeave(@PathVariable Long id) {
        LeaveRequest leave = leaveService.rejectLeave(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Leave rejected successfully", leave));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getAll() {
        List<LeaveRequest> leaves = leaveService.getAllLeaves();
        return ResponseEntity.ok(new ApiResponse<>(true, "Leave requests fetched successfully", leaves));
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getByEmployee(@PathVariable Long empId) {
        List<LeaveRequest> leaves = leaveService.getLeavesByEmployee(empId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Employee leave requests fetched", leaves));
    }
    
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportLeaveExcel() {

        byte[] excel =
                excelReportService.generateLeaveExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=leave.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}
