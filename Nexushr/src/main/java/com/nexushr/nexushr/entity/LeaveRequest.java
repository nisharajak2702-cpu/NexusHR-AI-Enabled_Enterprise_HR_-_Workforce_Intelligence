package com.nexushr.nexushr.entity;

import jakarta.persistence.*;

import com.nexushr.nexushr.enums.LeaveStatus;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fromDate;
    private LocalDate toDate;

    private String reason;

    private String status; // PENDING, APPROVED, REJECTED
    
    @Enumerated(EnumType.STRING)
    private LeaveStatus leaveStatus;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}