package com.nexushr.nexushr.dto;

import lombok.Data;

@Data
public class PerformanceDTO {

    private Long employeeId;

    private String reviewPeriod;

    private String reviewer;

    private Integer technicalSkill;

    private Integer communication;

    private Integer teamwork;

    private Integer punctuality;

    private Integer problemSolving;

    private Integer leadership;

    private String remarks;
}