package com.nexushr.nexushr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nexushr.nexushr.dto.PerformanceDTO;
import com.nexushr.nexushr.entity.PerformanceReview;
import com.nexushr.nexushr.service.PerformanceService;

@RestController
@RequestMapping("/performance")
public class PerformanceController {
	 @Autowired
	    private PerformanceService performanceService;
	 
	 @PostMapping
	 public ResponseEntity<PerformanceReview> createReview(
	         @RequestBody PerformanceDTO dto) {

	     return ResponseEntity.ok(
	             performanceService.createReview(dto));

	 }
	 
	 @GetMapping
	 public ResponseEntity<List<PerformanceReview>> getAllReviews() {

	     return ResponseEntity.ok(
	             performanceService.getAllReviews());

	 }
	 @GetMapping("/{id}")
	 public ResponseEntity<PerformanceReview> getReview(
	         @PathVariable Long id) {

	     return ResponseEntity.ok(
	             performanceService.getReview(id));

	 }

	 @PutMapping("/{id}")
	 public ResponseEntity<PerformanceReview> updateReview(
	         @PathVariable Long id,
	         @RequestBody PerformanceDTO dto) {

	     return ResponseEntity.ok(
	             performanceService.updateReview(id, dto));

	 }
	 
	 @GetMapping("/employee/{id}")
	 public ResponseEntity<List<PerformanceReview>> getEmployeeReviews(
	         @PathVariable Long id) {

	     return ResponseEntity.ok(
	             performanceService.getEmployeeReviews(id));

	 }
	 @DeleteMapping("/{id}")
	 public ResponseEntity<String> deleteReview(
	         @PathVariable Long id) {

	     performanceService.deleteReview(id);

	     return ResponseEntity.ok("Performance Review Deleted Successfully.");

	 }
}