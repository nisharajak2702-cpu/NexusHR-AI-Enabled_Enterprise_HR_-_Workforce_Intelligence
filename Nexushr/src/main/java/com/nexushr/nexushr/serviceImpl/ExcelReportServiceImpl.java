package com.nexushr.nexushr.serviceImpl;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nexushr.nexushr.entity.Attendance;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.entity.LeaveRequest;
import com.nexushr.nexushr.entity.Payroll;
import com.nexushr.nexushr.repository.AttendanceRepository;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.repository.LeaveRepository;
import com.nexushr.nexushr.repository.PayrollRepository;
import com.nexushr.nexushr.service.ExcelReportService;
import com.nexushr.nexushr.util.ExcelGenerator;

@Service
public class ExcelReportServiceImpl implements ExcelReportService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Override
    public byte[] generateEmployeeExcel() {

        try {

            List<Employee> employees =
                    employeeRepository.findAll();

            return ExcelGenerator.generateEmployeeExcel(
                    employees);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate Employee Excel Report",
                    e);

        }

    }

    @Override
    public byte[] generateAttendanceExcel() {

        try {

            List<Attendance> attendance =
                    attendanceRepository.findAll();

            return ExcelGenerator.generateAttendanceExcel(
                    attendance);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate Attendance Excel Report",
                    e);

        }

    }

    @Override
    public byte[] generateLeaveExcel() {

        try {

            List<LeaveRequest> leaves =
                    leaveRepository.findAll();

            return ExcelGenerator.generateLeaveExcel(
                    leaves);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate Leave Excel Report",
                    e);

        }

    }

    @Override
    public byte[] generatePayrollExcel() {

        try {

            List<Payroll> payrolls =
                    payrollRepository.findAll();

            return ExcelGenerator.generatePayrollExcel(
                    payrolls);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate Payroll Excel Report",
                    e);

        }

    }

}