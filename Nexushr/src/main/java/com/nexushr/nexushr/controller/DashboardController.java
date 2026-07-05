package com.nexushr.nexushr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nexushr.nexushr.dto.DashboardDTO;
import com.nexushr.nexushr.service.DashboardService;
import com.nexushr.nexushr.util.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
        name = "Employee Management",
        description = "Employee CRUD APIs"
)
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDTO>> dashboard() {

        DashboardDTO dto = dashboardService.getDashboard();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Dashboard Loaded Successfully",
                        dto
                )
        );

    }
}