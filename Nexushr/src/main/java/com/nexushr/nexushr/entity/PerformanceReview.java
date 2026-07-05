package com.nexushr.nexushr.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="performance_reviews")
@Data
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="employee_id")
    private Employee employee;

    private String reviewPeriod;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public String getReviewPeriod() {
		return reviewPeriod;
	}

	public void setReviewPeriod(String reviewPeriod) {
		this.reviewPeriod = reviewPeriod;
	}

	public String getReviewer() {
		return reviewer;
	}

	public void setReviewer(String reviewer) {
		this.reviewer = reviewer;
	}

	public Integer getTechnicalSkill() {
		return technicalSkill;
	}

	public void setTechnicalSkill(Integer technicalSkill) {
		this.technicalSkill = technicalSkill;
	}

	public Integer getCommunication() {
		return communication;
	}

	public void setCommunication(Integer communication) {
		this.communication = communication;
	}

	public Integer getTeamwork() {
		return teamwork;
	}

	public void setTeamwork(Integer teamwork) {
		this.teamwork = teamwork;
	}

	public Integer getPunctuality() {
		return punctuality;
	}

	public void setPunctuality(Integer punctuality) {
		this.punctuality = punctuality;
	}

	public Integer getProblemSolving() {
		return problemSolving;
	}

	public void setProblemSolving(Integer problemSolving) {
		this.problemSolving = problemSolving;
	}

	public Integer getLeadership() {
		return leadership;
	}

	public void setLeadership(Integer leadership) {
		this.leadership = leadership;
	}

	public Double getOverallRating() {
		return overallRating;
	}

	public void setOverallRating(Double overallRating) {
		this.overallRating = overallRating;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public LocalDate getReviewDate() {
		return reviewDate;
	}

	public void setReviewDate(LocalDate reviewDate) {
		this.reviewDate = reviewDate;
	}

	private String reviewer;

    private Integer technicalSkill;

    private Integer communication;

    private Integer teamwork;

    private Integer punctuality;

    private Integer problemSolving;

    private Integer leadership;

    private Double overallRating;

    @Column(length=1000)
    private String remarks;

    private LocalDate reviewDate;
}