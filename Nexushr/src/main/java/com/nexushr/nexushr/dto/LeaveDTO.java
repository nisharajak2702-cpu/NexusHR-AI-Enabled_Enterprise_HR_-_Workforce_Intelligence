package com.nexushr.nexushr.dto;

import lombok.Data;

@Data
public class LeaveDTO {

    private Long employeeId;
    private String fromDate;
    private String toDate;
    private String reason;
}