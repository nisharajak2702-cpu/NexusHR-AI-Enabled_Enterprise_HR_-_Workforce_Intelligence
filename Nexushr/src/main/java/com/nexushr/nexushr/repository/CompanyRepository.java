package com.nexushr.nexushr.repository;

import com.nexushr.nexushr.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository
        extends JpaRepository<Company, Long> {

}