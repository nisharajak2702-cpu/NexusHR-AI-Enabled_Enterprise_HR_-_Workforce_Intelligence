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
    Chip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LeaveService from "../../services/leaveService";

export default function LeaveTable() {
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
        fromDate: "",
        toDate: "",
        reason: ""
    });

    useEffect(() => {
        loadLeaveRequests();
    }, [page, pageSize, sortModel]);

    const normalizeLeaveRows = (rows) => {
        return Array.isArray(rows)
            ? rows
                  .filter(Boolean)
                  .map((row) => {
                      const fromDate = row.fromDate ? new Date(row.fromDate) : null;
                      const toDate = row.toDate ? new Date(row.toDate) : null;
                      const numberOfDays =
                          fromDate && toDate && !Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime())
                              ? Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1
                              : "";

                      return {
                          ...row,
                          employeeId: row.employee?.id ?? row.employeeId ?? "",
                          employeeName:
                              row.employee?.firstName && row.employee?.lastName
                                  ? `${row.employee.firstName} ${row.employee.lastName}`
                                  : row.employeeName ?? "",
                          status: row.status || row.leaveStatus,
                          numberOfDays
                      };
                  })
            : [];
    };

    const loadLeaveRequests = async () => {
        setLoading(true);
        try {
            const response = await LeaveService.getLeaveRequests(
                page,
                pageSize,
                sortModel[0]?.field || "id",
                sortModel[0]?.sort || "asc"
            );
            const data = response.data?.content ?? response.data?.data ?? [];
            const normalized = normalizeLeaveRows(data);
            setRecords(normalized);
            setRowCount(response.data?.totalElements ?? (Array.isArray(normalized) ? normalized.length : 0));
        } catch (error) {
            console.error("Error loading leave requests:", error);
        }
        setLoading(false);
    };

    const handleOpenDialog = (record = null) => {
        if (record) {
            setEditingId(record.id);
            setFormData({
                employeeId: record.employee?.id ?? record.employeeId ?? "",
                fromDate: record.fromDate,
                toDate: record.toDate,
                reason: record.reason
            });
        } else {
            setEditingId(null);
            setFormData({
                employeeId: "",
                fromDate: "",
                toDate: "",
                reason: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        try {
            const payload = {
                employeeId: Number(formData.employeeId),
                fromDate: formData.fromDate,
                toDate: formData.toDate,
                reason: formData.reason
            };

            if (editingId) {
                await LeaveService.updateLeaveRequest(editingId, payload);
            } else {
                await LeaveService.createLeaveRequest(payload);
            }
            handleCloseDialog();
            loadLeaveRequests();
        } catch (error) {
            console.error("Error saving leave request:", error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await LeaveService.approveLeave(id);
            loadLeaveRequests();
        } catch (error) {
            console.error("Error approving leave:", error);
        }
    };

    const handleReject = async (id) => {
        try {
            await LeaveService.rejectLeave(id, "Rejected by admin");
            loadLeaveRequests();
        } catch (error) {
            console.error("Error rejecting leave:", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await LeaveService.exportExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "leave-requests.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "APPROVED":
                return "success";
            case "REJECTED":
                return "error";
            case "PENDING":
                return "warning";
            default:
                return "default";
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "employeeId",
            headerName: "Employee ID",
            width: 120
        },
        {
            field: "employeeName",
            headerName: "Employee Name",
            width: 180
        },
        { field: "fromDate", headerName: "From Date", width: 130 },
        { field: "toDate", headerName: "To Date", width: 130 },
        {
            field: "numberOfDays",
            headerName: "Days",
            width: 80
        },
        {
            field: "reason",
            headerName: "Reason",
            width: 220,
            flex: 1
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip label={params.row.status} color={getStatusColor(params.row.status)} />
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 220,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    {params.row.status === "PENDING" && (
                        <>
                            <Button
                                size="small"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleApprove(params.row.id)}
                            >
                                Approve
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleReject(params.row.id)}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="h5">Leave Management</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Request Leave
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
                        onClick={loadLeaveRequests}
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
                <DialogTitle>{editingId ? "Edit Leave Request" : "Request Leave"}</DialogTitle>
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
                        label="From Date"
                        type="date"
                        value={formData.fromDate}
                        onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="To Date"
                        type="date"
                        value={formData.toDate}
                        onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Reason"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
