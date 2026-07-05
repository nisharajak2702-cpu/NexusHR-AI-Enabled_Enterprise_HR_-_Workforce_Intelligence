package com.nexushr.nexushr.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private LocalDateTime checkIn;

    private LocalDateTime checkOut;

    private String status; // PRESENT, ABSENT, HALF_DAY

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}