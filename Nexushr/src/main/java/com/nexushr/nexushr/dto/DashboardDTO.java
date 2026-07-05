package com.nexushr.nexushr.dto;

public class DashboardDTO {

    private Long totalEmployees;

    private Long totalDepartments;

    private Long presentToday;

    private Long absentToday;

    private Long pendingLeaves;

    private Long payrollGenerated;

    private Double averagePerformance;

	public Long getTotalEmployees() {
		return totalEmployees;
	}

	public void setTotalEmployees(Long totalEmployees) {
		this.totalEmployees = totalEmployees;
	}

	public Long getTotalDepartments() {
		return totalDepartments;
	}

	public void setTotalDepartments(Long totalDepartments) {
		this.totalDepartments = totalDepartments;
	}

	public Long getPresentToday() {
		return presentToday;
	}

	public void setPresentToday(Long presentToday) {
		this.presentToday = presentToday;
	}

	public Long getAbsentToday() {
		return absentToday;
	}

	public void setAbsentToday(Long absentToday) {
		this.absentToday = absentToday;
	}

	public Long getPendingLeaves() {
		return pendingLeaves;
	}

	public void setPendingLeaves(Long pendingLeaves) {
		this.pendingLeaves = pendingLeaves;
	}

	public Long getPayrollGenerated() {
		return payrollGenerated;
	}

	public void setPayrollGenerated(Long payrollGenerated) {
		this.payrollGenerated = payrollGenerated;
	}

	public Double getAveragePerformance() {
		return averagePerformance;
	}

	public void setAveragePerformance(Double averagePerformance) {
		this.averagePerformance = averagePerformance;
	}

    // Generate Getters and Setters
}