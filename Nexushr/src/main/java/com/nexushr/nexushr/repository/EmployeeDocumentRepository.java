package com.nexushr.nexushr.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexushr.nexushr.entity.EmployeeDocument;

public interface EmployeeDocumentRepository
        extends JpaRepository<EmployeeDocument, Long> {

    List<EmployeeDocument> findByEmployeeId(Long employeeId);

}