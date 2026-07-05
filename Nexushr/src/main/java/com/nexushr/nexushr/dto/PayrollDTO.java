package com.nexushr.nexushr.dto;

import java.math.BigDecimal;

import com.nexushr.nexushr.enums.PaymentMode;
import com.nexushr.nexushr.enums.PaymentStatus;

import lombok.Data;

@Data
public class PayrollDTO {

    private Long employeeId;

    private String month;

    private Integer year;

    private BigDecimal basicSalary;

    private BigDecimal hra;

    private BigDecimal da;

    private BigDecimal bonus;

    private BigDecimal deduction;
    
    private BigDecimal pf;

    private BigDecimal esi;

    private BigDecimal professionalTax;

    private BigDecimal incomeTax;

    private BigDecimal overtimeAmount;
    
    private BigDecimal leaveDeduction;
    
    private PaymentStatus paymentStatus;
    
    private PaymentMode paymentMode;

    private String generatedBy;

}