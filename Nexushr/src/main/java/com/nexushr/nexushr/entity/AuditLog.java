package com.nexushr.nexushr.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name="audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String action;

    private String module;

    @Column(length=2000)
    private String description;

    private String ipAddress;

    private LocalDateTime createdAt;

}