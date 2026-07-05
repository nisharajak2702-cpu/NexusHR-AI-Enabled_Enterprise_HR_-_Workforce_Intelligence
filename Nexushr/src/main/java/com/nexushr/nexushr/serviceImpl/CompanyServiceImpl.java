package com.nexushr.nexushr.serviceImpl;

import com.nexushr.nexushr.entity.Company;
import com.nexushr.nexushr.repository.CompanyRepository;
import com.nexushr.nexushr.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl
        implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public Company getCompany(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Company not found"));
    }

    @Override
    public Company updateCompany(Long id, Company company) {
        Company existingCompany = getCompany(id);
        existingCompany.setCompanyName(company.getCompanyName());
        existingCompany.setEmail(company.getEmail());
        existingCompany.setPhone(company.getPhone());
        existingCompany.setAddress(company.getAddress());
        return companyRepository.save(existingCompany);
    }

    @Override
    public void deleteCompany(Long id) {
        Company company = getCompany(id);
        companyRepository.delete(company);
    }
}
