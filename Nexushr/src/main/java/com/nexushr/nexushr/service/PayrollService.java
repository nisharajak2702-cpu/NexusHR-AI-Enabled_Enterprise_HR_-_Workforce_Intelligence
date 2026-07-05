package com.nexushr.nexushr.service;

import java.util.List;

import com.nexushr.nexushr.dto.PayrollDTO;
import com.nexushr.nexushr.entity.Payroll;

public interface PayrollService {

    Payroll generatePayroll(PayrollDTO dto);

    List<Payroll> getAllPayrolls();

    Payroll getPayrollById(Long id);

    List<Payroll> getPayrollByEmployee(Long employeeId);

    void deletePayroll(Long id);
}