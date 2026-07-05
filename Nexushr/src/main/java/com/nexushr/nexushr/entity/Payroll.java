package com.nexushr.nexushr.entity;

import jakarta.persistence.*;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import com.nexushr.nexushr.enums.PaymentMode;
import com.nexushr.nexushr.enums.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@Table(name = "payroll")
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String month;

    private Integer year;

    @Column(precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 12, scale = 2)
    private BigDecimal hra;

    @Column(precision = 12, scale = 2)
    private BigDecimal da;

    @Column(precision = 12, scale = 2)
    private BigDecimal bonus;

    @Column(precision = 12, scale = 2)
    private BigDecimal deduction;

    @Column(precision = 12, scale = 2)
    private BigDecimal grossSalary;

    @Column(precision = 12, scale = 2)
    private BigDecimal netSalary;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal pf;

    @Column(precision = 12, scale = 2)
    private BigDecimal esi;

    @Column(precision = 12, scale = 2)
    private BigDecimal professionalTax;

    @Column(precision = 12, scale = 2)
    private BigDecimal incomeTax;

    @Column(precision = 12, scale = 2)
    private BigDecimal overtimeAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal leaveDeduction;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    private String payslipNumber;    // Example: PSL-2026-000001

    private String generatedBy;

    private LocalDate generatedDate;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({
        "payrolls",
        "hibernateLazyInitializer",
        "handler"
    })
    private Employee employee;
}