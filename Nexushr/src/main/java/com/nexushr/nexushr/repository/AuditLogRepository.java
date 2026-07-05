package com.nexushr.nexushr.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexushr.nexushr.entity.AuditLog;

public interface AuditLogRepository
extends JpaRepository<AuditLog,Long>{

}