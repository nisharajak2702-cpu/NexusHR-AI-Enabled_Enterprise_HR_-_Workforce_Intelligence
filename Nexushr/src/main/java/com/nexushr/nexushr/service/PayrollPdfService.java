package com.nexushr.nexushr.service;

public interface PayrollPdfService {

    byte[] generatePayslip(Long payrollId);

}