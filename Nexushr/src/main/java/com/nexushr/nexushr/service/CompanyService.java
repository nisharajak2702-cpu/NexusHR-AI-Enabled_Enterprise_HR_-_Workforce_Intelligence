package com.nexushr.nexushr.service;

import com.nexushr.nexushr.entity.Company;

import java.util.List;

public interface CompanyService {

    Company saveCompany(Company company);

    List<Company> getAllCompanies();

    Company getCompany(Long id);

    Company updateCompany(Long id, Company company);

    void deleteCompany(Long id);

}