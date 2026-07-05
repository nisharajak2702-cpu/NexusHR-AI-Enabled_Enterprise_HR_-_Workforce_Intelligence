import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Chip,
    Card,
    CardContent
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadFileIcon from "@mui/icons-material/GetApp";
import PayrollService from "../../services/payrollService";

export default function PayrollTable() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: "",
        month: "",
        year: "",
        baseSalary: "",
        bonus: "0",
        deductions: "0"
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        loadPayroll();
    }, []);

    const loadPayroll = async () => {
        setLoading(true);
        try {
            const response = await PayrollService.getPayroll(
                page,
                pageSize,
                sortModel[0]?.field || "id",
                sortModel[0]?.sort || "asc"
            );
            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content ?? response.data?.data ?? [];
            setRecords(data);
            setRowCount(response.data?.totalElements ?? data.length);
        } catch (error) {
            console.error("Error loading payroll:", error);
        }
        setLoading(false);
    };

    const handleOpenDialog = () => {
        const now = new Date();
        setFormError("");
        setFormData({
            employeeId: "",
            month: String(now.getMonth() + 1).padStart(2, "0"),
            year: String(now.getFullYear()),
            baseSalary: "",
            bonus: "0",
            deductions: "0"
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormError("");
    };

    const getCurrentUser = () => {
        const token = localStorage.getItem("token");
        if (!token) return "admin";
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.sub || payload.username || "admin";
        } catch {
            return "admin";
        }
    };

    const handleSave = async () => {
        try {
            const employeeId = Number(formData.employeeId);
            if (!employeeId || isNaN(employeeId)) {
                setFormError("Employee ID is required.");
                return;
            }

            const month = String(formData.month).padStart(2, "0");
            const year = Number(formData.year);
            if (!month || month.length > 2 || month === "00" || isNaN(year)) {
                setFormError("Valid month and year are required.");
                return;
            }

            const basicSalary = Number(formData.baseSalary);
            if (Number.isNaN(basicSalary) || basicSalary <= 0) {
                setFormError("Base Salary must be a positive number.");
                return;
            }

            const existingResponse = await PayrollService.getPayrollByEmployee(employeeId);
            const existingPayrolls = Array.isArray(existingResponse.data)
                ? existingResponse.data
                : existingResponse.data?.content ?? [];
            const duplicate = existingPayrolls.find(
                (record) => record.month === month && Number(record.year) === year
            );
            if (duplicate) {
                setFormError(
                    `Payroll already generated for employee ${employeeId} for ${month}/${year}.` 
                );
                return;
            }

            const payload = {
                employeeId,
                month,
                year,
                basicSalary,
                hra: 0,
                da: 0,
                bonus: Number(formData.bonus),
                deduction: Number(formData.deductions),
                pf: 0,
                esi: 0,
                professionalTax: 0,
                incomeTax: 0,
                overtimeAmount: 0,
                leaveDeduction: 0,
                paymentStatus: "PENDING",
                paymentMode: "CASH",
                generatedBy: getCurrentUser()
            };

            await PayrollService.createPayroll(payload);
            setFormError("");
            handleCloseDialog();
            loadPayroll();
        } catch (error) {
            const message =
                error?.response?.data?.message || error?.message || "Error saving payroll.";
            setFormError(message);
            console.error("Error saving payroll:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await PayrollService.deletePayroll(id);
            setDeleteConfirm(null);
            loadPayroll();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    const downloadPayslip = async (id) => {
        try {
            const response = await PayrollService.getPayslip(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `payslip-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading payslip:", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await PayrollService.exportExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "payroll.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "employeeId", headerName: "Employee ID", width: 120 },
        { field: "month", headerName: "Month", width: 100 },
        { field: "year", headerName: "Year", width: 100 },
        { field: "baseSalary", headerName: "Base Salary", width: 130 },
        { field: "bonus", headerName: "Bonus", width: 100 },
        { field: "deduction", headerName: "Deductions", width: 120 },
        {
            field: "netSalary",
            headerName: "Net Salary",
            width: 130,
            renderCell: (params) => {
                const net = (params.row.baseSalary || 0) + (params.row.bonus || 0) - (params.row.deduction || 0);
                return <strong>{net.toFixed(2)}</strong>;
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 250,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        color="primary"
                        startIcon={<DownloadFileIcon />}
                        onClick={() => downloadPayslip(params.row.id)}
                    >
                        Payslip
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteConfirm(params.row.id)}
                    >
                        Delete
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h5">Payroll Management</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                    >
                        Add Payroll
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={downloadExcel}
                    >
                        Export
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadPayroll}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {loading ? (
                <CircularProgress />
            ) : (
                        <DataGrid
                        rows={records}
                        columns={columns}
                        pagination
                        paginationModel={{ pageSize, page }}
                        onPaginationModelChange={(model) => {
                            setPage(model.page);
                            setPageSize(model.pageSize);
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        paginationMode="client"
                        sortingMode="client"
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}
                        sx={{ height: 500 }}
                    />
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? "Edit Payroll" : "Add Payroll"}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Employee ID"
                        type="number"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Month"
                        type="number"
                        inputProps={{ min: 1, max: 12 }}
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Base Salary"
                        type="number"
                        value={formData.baseSalary}
                        onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Bonus"
                        type="number"
                        value={formData.bonus}
                        onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Deductions"
                        type="number"
                        value={formData.deductions}
                        onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                        margin="normal"
                    />
                    {formError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {formError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this payroll record?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    <Button
                        onClick={() => handleDelete(deleteConfirm)}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
