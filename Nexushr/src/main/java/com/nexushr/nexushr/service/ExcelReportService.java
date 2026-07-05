package com.nexushr.nexushr.service;

public interface ExcelReportService {

    byte[] generateEmployeeExcel();

    byte[] generateAttendanceExcel();

    byte[] generateLeaveExcel();

    byte[] generatePayrollExcel();

}