import api from "../api/axios";

const PayrollService = {
    getPayroll(page = 0, size = 10, sortBy = "id", direction = "asc") {
        return api.get("/payroll", {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
    },

    getPayrollRecord(id) {
        return api.get(`/payroll/${id}`);
    },

    createPayroll(payroll) {
        return api.post("/payroll/generate", payroll);
    },

    updatePayroll(id, payroll) {
        return api.put(`/payroll/${id}`, payroll);
    },

    deletePayroll(id) {
        return api.delete(`/payroll/${id}`);
    },

    getPayslip(id) {
        return api.get(`/payroll/${id}/payslip`, {
            responseType: "blob"
        });
    },

    getPayrollByEmployee(employeeId) {
        return api.get(`/payroll/employee/${employeeId}`);
    },

    processPayroll(month, year) {
        return api.post("/payroll/process", { month, year });
    },

    exportExcel() {
        return api.get("/payroll/export/excel", {
            responseType: "blob"
        });
    }
};

export default PayrollService;
