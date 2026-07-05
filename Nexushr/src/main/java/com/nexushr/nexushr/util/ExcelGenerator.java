package com.nexushr.nexushr.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.nexushr.nexushr.entity.Attendance;
import com.nexushr.nexushr.entity.Employee;
import com.nexushr.nexushr.entity.LeaveRequest;
import com.nexushr.nexushr.entity.Payroll;

public class ExcelGenerator {

    private ExcelGenerator() {
    }

    private static CellStyle createHeaderStyle(XSSFWorkbook workbook) {

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setBold(true);

        font.setColor(IndexedColors.WHITE.getIndex());

        style.setFont(font);

        style.setFillForegroundColor(
                IndexedColors.DARK_BLUE.getIndex());

        style.setFillPattern(
                FillPatternType.SOLID_FOREGROUND);

        style.setAlignment(
                HorizontalAlignment.CENTER);

        style.setVerticalAlignment(
                VerticalAlignment.CENTER);

        style.setBorderBottom(
                BorderStyle.THIN);

        style.setBorderTop(
                BorderStyle.THIN);

        style.setBorderLeft(
                BorderStyle.THIN);

        style.setBorderRight(
                BorderStyle.THIN);

        return style;
    }

    private static CellStyle createBodyStyle(
            XSSFWorkbook workbook) {

        CellStyle style = workbook.createCellStyle();

        style.setBorderBottom(
                BorderStyle.THIN);

        style.setBorderTop(
                BorderStyle.THIN);

        style.setBorderLeft(
                BorderStyle.THIN);

        style.setBorderRight(
                BorderStyle.THIN);

        return style;
    }

    public static byte[] generateEmployeeExcel(
            List<Employee> employees)
            throws IOException {

        XSSFWorkbook workbook =
                new XSSFWorkbook();

        XSSFSheet sheet =
                workbook.createSheet("Employees");

        CellStyle headerStyle =
                createHeaderStyle(workbook);

        CellStyle bodyStyle =
                createBodyStyle(workbook);

        Row header =
                sheet.createRow(0);

        String[] columns = {

                "ID",

                "First Name",

                "Last Name",

                "Email",

                "Phone",

                "Position",

                "Salary",

                "Department"

        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell =
                    header.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(headerStyle);

        }

        int rowNum = 1;

        for (Employee employee : employees) {

            Row row =
                    sheet.createRow(rowNum++);

            Cell c0 =
                    row.createCell(0);

            c0.setCellValue(employee.getId());

            c0.setCellStyle(bodyStyle);

            Cell c1 =
                    row.createCell(1);

            c1.setCellValue(employee.getFirstName());

            c1.setCellStyle(bodyStyle);

            Cell c2 =
                    row.createCell(2);

            c2.setCellValue(employee.getLastName());

            c2.setCellStyle(bodyStyle);

            Cell c3 =
                    row.createCell(3);

            c3.setCellValue(employee.getEmail());

            c3.setCellStyle(bodyStyle);

            Cell c4 =
                    row.createCell(4);

            c4.setCellValue(employee.getPhone());

            c4.setCellStyle(bodyStyle);

            Cell c5 =
                    row.createCell(5);

            c5.setCellValue(employee.getPosition());

            c5.setCellStyle(bodyStyle);

            Cell c6 =
                    row.createCell(6);

                        if (employee.getSalary() != null) {
                                try {
                                        double sal = Double.parseDouble(employee.getSalary());
                                        c6.setCellValue(sal);
                                } catch (NumberFormatException ex) {
                                        c6.setCellValue("");
                                }

                        }

            c6.setCellStyle(bodyStyle);

            Cell c7 =
                    row.createCell(7);

                        if (employee.getDepartment() != null) {

                                c7.setCellValue(
                                                employee.getDepartment().getName());

                        }

            c7.setCellStyle(bodyStyle);

        }

        for (int i = 0; i < columns.length; i++) {

            sheet.autoSizeColumn(i);

        }

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();

    }
    
    public static byte[] generateAttendanceExcel(
            List<Attendance> attendanceList)
            throws IOException {

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Attendance");

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle bodyStyle = createBodyStyle(workbook);

        Row header = sheet.createRow(0);

        String[] columns = {
                "ID",
                "Employee ID",
                "Employee Name",
                "Date",
                "Check In",
                "Check Out",
                "Status"
        };

        for (int i = 0; i < columns.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;

        for (Attendance attendance : attendanceList) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(attendance.getId());

            row.createCell(1).setCellValue(
                    attendance.getEmployee().getId());

            row.createCell(2).setCellValue(
                    attendance.getEmployee().getFirstName() + " "
                            + attendance.getEmployee().getLastName());

            row.createCell(3).setCellValue(
                    attendance.getDate().toString());

            row.createCell(4).setCellValue(
                    attendance.getCheckIn() == null
                            ? ""
                            : attendance.getCheckIn().toString());

            row.createCell(5).setCellValue(
                    attendance.getCheckOut() == null
                            ? ""
                            : attendance.getCheckOut().toString());

            row.createCell(6).setCellValue(
                    attendance.getStatus());

            for (int i = 0; i < columns.length; i++) {
                row.getCell(i).setCellStyle(bodyStyle);
            }
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();
    }

    public static byte[] generateLeaveExcel(
            List<LeaveRequest> leaveList)
            throws IOException {

        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("Leaves");

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle bodyStyle = createBodyStyle(workbook);

        Row header = sheet.createRow(0);

        String[] columns = {
                "ID",
                "Employee ID",
                "Employee Name",
                "From Date",
                "To Date",
                "Reason",
                "Status"
        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell = header.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;

        for (LeaveRequest leave : leaveList) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(leave.getId());

            row.createCell(1).setCellValue(
                    leave.getEmployee().getId());

            row.createCell(2).setCellValue(
                    leave.getEmployee().getFirstName() + " "
                            + leave.getEmployee().getLastName());

            row.createCell(3).setCellValue(
                    leave.getFromDate().toString());

            row.createCell(4).setCellValue(
                    leave.getToDate().toString());

            row.createCell(5).setCellValue(
                    leave.getReason());

            row.createCell(6).setCellValue(
                    leave.getStatus());

            for (int i = 0; i < columns.length; i++) {
                row.getCell(i).setCellStyle(bodyStyle);
            }
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();
    }

    public static byte[] generatePayrollExcel(
            List<Payroll> payrolls)
            throws IOException {

        XSSFWorkbook workbook = new XSSFWorkbook();

        XSSFSheet sheet =
                workbook.createSheet("Payroll");

        CellStyle headerStyle =
                createHeaderStyle(workbook);

        CellStyle bodyStyle =
                createBodyStyle(workbook);

        Row header = sheet.createRow(0);

        String[] columns = {
                "ID",
                "Employee",
                "Month",
                "Year",
                "Gross Salary",
                "Net Salary",
                "Payment Status",
                "Generated Date"
        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell = header.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;

        for (Payroll payroll : payrolls) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(payroll.getId());

            row.createCell(1).setCellValue(
                    payroll.getEmployee().getFirstName()
                            + " "
                            + payroll.getEmployee().getLastName());

            row.createCell(2).setCellValue(
                    payroll.getMonth());

            row.createCell(3).setCellValue(
                    payroll.getYear());

            if (payroll.getGrossSalary() != null) {
                row.createCell(4).setCellValue(
                        payroll.getGrossSalary().doubleValue());
            }

            if (payroll.getNetSalary() != null) {
                row.createCell(5).setCellValue(
                        payroll.getNetSalary().doubleValue());
            }

            row.createCell(6).setCellValue(
                    payroll.getPaymentStatus().name());

            row.createCell(7).setCellValue(
                    payroll.getGeneratedDate().toString());

            for (int i = 0; i < columns.length; i++) {

                if (row.getCell(i) != null) {
                    row.getCell(i).setCellStyle(bodyStyle);
                }
            }
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();
    }

}