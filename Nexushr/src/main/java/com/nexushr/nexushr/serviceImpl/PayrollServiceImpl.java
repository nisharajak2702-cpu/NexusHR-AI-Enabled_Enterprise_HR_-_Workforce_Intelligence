package com.nexushr.nexushr.serviceImpl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.nexushr.nexushr.dto.PayrollDTO;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.entity.Payroll;
import com.nexushr.nexushr.enums.PaymentStatus;
import com.nexushr.nexushr.exception.ResourceNotFoundException;
import com.nexushr.nexushr.repository.EmployeeRepository;
import com.nexushr.nexushr.repository.PayrollRepository;
import com.nexushr.nexushr.service.PayrollService;

@Service
public class PayrollServiceImpl implements PayrollService{

	@Autowired
	private PayrollRepository payrollRepository;

	@Autowired
	private EmployeeRepository employeeRepository;
	
	@Override
	public Payroll generatePayroll(PayrollDTO dto) {
		
		// 1. Check for duplicate payroll
	    Optional<Payroll> existingPayroll =
	            payrollRepository.findByEmployeeIdAndMonthAndYear(
	                    dto.getEmployeeId(),
	                    dto.getMonth(),
	                    dto.getYear()
	            );

	    if (existingPayroll.isPresent()) {
	        throw new IllegalStateException("Payroll already generated for this employee.");
	    }


	    Employee employee = employeeRepository.findById(dto.getEmployeeId())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Employee not found with id: " + dto.getEmployeeId()));

	    if (dto.getPaymentMode() == null) {
	        throw new IllegalStateException("paymentMode is required.");
	    }

	    Payroll payroll = new Payroll();

	    payroll.setEmployee(employee);

	    payroll.setMonth(dto.getMonth());

	    payroll.setYear(dto.getYear());

	    payroll.setBasicSalary(nz(dto.getBasicSalary()));

	    payroll.setHra(nz(dto.getHra()));

	    payroll.setDa(nz(dto.getDa()));

	    payroll.setBonus(nz(dto.getBonus()));

	    payroll.setDeduction(nz(dto.getDeduction()));
	    
	    payroll.setPf(nz(dto.getPf()));

	    payroll.setEsi(nz(dto.getEsi()));

	    payroll.setProfessionalTax(nz(dto.getProfessionalTax()));

	    payroll.setIncomeTax(nz(dto.getIncomeTax()));

	    payroll.setOvertimeAmount(nz(dto.getOvertimeAmount()));

	    payroll.setLeaveDeduction(nz(dto.getLeaveDeduction()));

	    BigDecimal gross =
	            nz(dto.getBasicSalary())
	                    .add(nz(dto.getHra()))
	                    .add(nz(dto.getDa()))
	                    .add(nz(dto.getBonus()))
	                    .add(nz(dto.getOvertimeAmount()));

	    payroll.setGrossSalary(gross);
	    
	    BigDecimal totalDeduction =
	            nz(dto.getPf())
	                    .add(nz(dto.getEsi()))
	                    .add(nz(dto.getProfessionalTax()))
	                    .add(nz(dto.getIncomeTax()))
	                    .add(nz(dto.getLeaveDeduction()))
	                    .add(nz(dto.getDeduction()));
	    
	    BigDecimal net =
	            gross.subtract(totalDeduction);

	    payroll.setNetSalary(net);
	    
	    payroll.setGeneratedDate(LocalDate.now());
	    
	    payroll.setPayslipNumber(
	            "PSL-"
	            + dto.getYear()
	            + "-"
	            + System.currentTimeMillis());
	    
	    payroll.setPaymentStatus(PaymentStatus.PENDING);
	    
	    // dto.getPaymentMode() is already a PaymentMode enum - no string parsing needed.
	    payroll.setPaymentMode(dto.getPaymentMode());

	    org.springframework.security.core.Authentication authentication =
	            SecurityContextHolder.getContext().getAuthentication();

	    String loggedInUsername =
	            (authentication != null) ? authentication.getName() : "system";

	    payroll.setGeneratedBy(loggedInUsername);
	    
	    return payrollRepository.save(payroll);
	}

	/**
	 * Treats a null BigDecimal (e.g. an optional field omitted from the request body)
	 * as zero instead of letting it blow up with a NullPointerException on .add()/.subtract().
	 */
	private BigDecimal nz(BigDecimal value) {
	    return value != null ? value : BigDecimal.ZERO;
	}

	@Override
	public List<Payroll> getAllPayrolls() {
	    return payrollRepository.findAll();
	}

	@Override
	public Payroll getPayrollById(Long id) {

	    return payrollRepository.findById(id)
	            .orElseThrow(() ->
	                    new RuntimeException("Payroll not found"));
	}

	@Override
	public List<Payroll> getPayrollByEmployee(Long employeeId) {

	    return payrollRepository.findByEmployeeId(employeeId);
	}

	@Override
	public void deletePayroll(Long id) {

	    Payroll payroll = payrollRepository.findById(id)
	            .orElseThrow(() ->
	                    new RuntimeException("Payroll not found"));

	    payrollRepository.delete(payroll);
	}
}