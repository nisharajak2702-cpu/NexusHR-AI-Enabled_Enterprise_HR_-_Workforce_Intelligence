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
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import AttendanceService from "../../services/attendanceService";

export default function AttendanceTable() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        status: "PRESENT",
        remarks: ""
    });

    useEffect(() => {
        loadAttendance();
    }, [page, pageSize, sortModel]);

    const normalizeAttendance = (rows) => {
        return Array.isArray(rows)
            ? rows.map((row) => ({
                  ...row,
                  employeeId: row.employee?.id ?? "",
                  employeeName: row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : ""
              }))
            : [];
    };

    const loadAttendance = async () => {
        setLoading(true);
        try {
            const response = await AttendanceService.getAttendance(
                page,
                pageSize,
                sortModel[0]?.field || "id",
                sortModel[0]?.sort || "asc"
            );
            const data = response.data?.content ?? response.data?.data ?? [];
            const normalized = normalizeAttendance(data);
            setRecords(normalized);
            setRowCount(response.data?.totalElements ?? normalized.length);
        } catch (error) {
            console.error("Error loading attendance:", error);
        }
        setLoading(false);
    };

    const handleOpenDialog = () => {
        setFormData({
            employeeId: "",
            date: new Date().toISOString().split("T")[0],
            status: "PRESENT",
            remarks: ""
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        try {
            const employeeId = Number(formData.employeeId);
            if (!employeeId || isNaN(employeeId)) {
                throw new Error("Employee ID must be a valid number");
            }

            await AttendanceService.checkIn(employeeId, {
                date: formData.date,
                status: formData.status,
                remarks: formData.remarks
            });
            handleCloseDialog();
            loadAttendance();
        } catch (error) {
            console.error("Error saving attendance:", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await AttendanceService.exportExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "attendance.xlsx");
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
        { field: "date", headerName: "Date", width: 130 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "remarks", headerName: "Remarks", flex: 1 }
    ];

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h5">Attendance Management</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Mark Attendance
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
                        onClick={loadAttendance}
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
                    rowCount={rowCount}
                    paginationMode="server"
                    sortingMode="server"
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}
                    sx={{ height: 500 }}
                />
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Check In Employee</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography sx={{ mb: 2 }}>
                        This action uses the backend attendance check-in endpoint.
                    </Typography>
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
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={formData.status}
                            label="Status"
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <MenuItem value="PRESENT">Present</MenuItem>
                            <MenuItem value="ABSENT">Absent</MenuItem>
                            <MenuItem value="LEAVE">Leave</MenuItem>
                            <MenuItem value="HALF_DAY">Half Day</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Remarks"
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
