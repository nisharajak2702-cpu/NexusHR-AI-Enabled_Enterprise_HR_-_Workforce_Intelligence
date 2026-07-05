package com.nexushr.nexushr.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nexushr.nexushr.service.AuditLogService;

@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditLogService auditLogService;

    /*
     * ==========================
     * EMPLOYEE MODULE
     * ==========================
     */

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.EmployeeServiceImpl.createEmployee(..))")
    public void employeeCreated(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "CREATE",
                "EMPLOYEE",
                "New employee created.");
    }

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.EmployeeServiceImpl.updateEmployee(..))")
    public void employeeUpdated(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "UPDATE",
                "EMPLOYEE",
                "Employee updated.");
    }

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.EmployeeServiceImpl.deleteEmployee(..))")
    public void employeeDeleted(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "DELETE",
                "EMPLOYEE",
                "Employee deleted.");
    }

    /*
     * ==========================
     * ATTENDANCE MODULE
     * ==========================
     */

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.AttendanceServiceImpl.checkIn(..))")
    public void checkIn(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "CHECK-IN",
                "ATTENDANCE",
                "Employee checked in.");
    }

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.AttendanceServiceImpl.checkOut(..))")
    public void checkOut(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "CHECK-OUT",
                "ATTENDANCE",
                "Employee checked out.");
    }

    /*
     * ==========================
     * LEAVE MODULE
     * ==========================
     */

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.LeaveServiceImpl.applyLeave(..))")
    public void leaveApplied(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "APPLY",
                "LEAVE",
                "Leave applied.");
    }

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.LeaveServiceImpl.approveLeave(..))")
    public void leaveApproved(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "APPROVE",
                "LEAVE",
                "Leave approved.");
    }

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.LeaveServiceImpl.rejectLeave(..))")
    public void leaveRejected(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "REJECT",
                "LEAVE",
                "Leave rejected.");
    }

    /*
     * ==========================
     * PAYROLL MODULE
     * ==========================
     */

    @AfterReturning(
            "execution(* com.nexushr.nexushr.serviceImpl.PayrollServiceImpl.generatePayroll(..))")
    public void payrollGenerated(JoinPoint joinPoint) {

        auditLogService.saveAudit(
                null,
                "GENERATE",
                "PAYROLL",
                "Payroll generated.");
    }

}