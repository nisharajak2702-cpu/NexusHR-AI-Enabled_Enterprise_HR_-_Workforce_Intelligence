package com.nexushr.nexushr.controller;

import com.nexushr.nexushr.entity.Attendance;
import com.nexushr.nexushr.service.AttendanceService;
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
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private ExcelReportService excelReportService;

    @PostMapping("/check-in/{empId}")
    public ResponseEntity<ApiResponse<Attendance>> checkIn(@PathVariable Long empId) {
        Attendance attendance = attendanceService.checkIn(empId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Check-in recorded successfully", attendance));
    }

    @PostMapping("/check-out/{empId}")
    public ResponseEntity<ApiResponse<Attendance>> checkOut(@PathVariable Long empId) {
        Attendance attendance = attendanceService.checkOut(empId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Check-out recorded successfully", attendance));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Attendance>>> getAll() {
        List<Attendance> records = attendanceService.getAllAttendance();
        return ResponseEntity.ok(new ApiResponse<>(true, "Attendance records fetched successfully", records));
    }
    
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportAttendanceExcel() {

        byte[] excel =
                excelReportService.generateAttendanceExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=attendance.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}
