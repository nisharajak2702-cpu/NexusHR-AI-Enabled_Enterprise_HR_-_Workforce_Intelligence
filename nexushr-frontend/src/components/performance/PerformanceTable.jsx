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
    Grid,
    Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PerformanceService from "../../services/performanceService";

const getCurrentUser = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return "admin";
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub || payload.username || "admin";
    } catch (error) {
        console.error("Error parsing user from token:", error);
        return "admin";
    }
};

const normalizePerformanceRows = (rows) => {
    if (!Array.isArray(rows)) return [];
    return rows.map((row, index) => {
        const employeeId =
            row.employee?.id ?? row.employeeId ?? row.employee_id ?? row.employee?.employeeId ?? row.employee?.employee_id ?? row.employee ?? "";
        const overallRating =
            row.overallRating ?? row.averageRating ?? row.rating ?? "";
        const reviewDate = row.reviewDate ?? row.date ?? row.createdAt ?? row.updatedAt ?? "";
        const backendId = row.id ?? row.performanceId ?? row.reviewId ?? row.performanceReviewId ?? null;
        const id = backendId ?? `row-${index}`;

        return {
            ...row,
            id,
            backendId,
            employeeId,
            overallRating,
            reviewDate
        };
    });
};

export default function PerformanceTable() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formError, setFormError] = useState("");
    const [pageError, setPageError] = useState("");
    const [formData, setFormData] = useState({
        employeeId: "",
        reviewPeriod: "",
        reviewer: "",
        technicalSkill: "5",
        communication: "5",
        teamwork: "5",
        punctuality: "5",
        problemSolving: "5",
        leadership: "5",
        remarks: ""
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadPerformance();
    }, []);

    const loadPerformance = async () => {
        setLoading(true);
        setPageError("");
        try {
            const response = await PerformanceService.getPerformanceReviews();
            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.content ?? response.data?.data ?? [];
            setRecords(normalizePerformanceRows(data));
        } catch (error) {
            console.error("Error loading performance reviews:", error);
            const message = error?.response?.data?.message || error?.message || "Failed to load performance reviews.";
            setPageError(message);
            setRecords([]);
        }
        setLoading(false);
    };

    const handleOpenDialog = (record = null) => {
        setFormError("");
        const today = new Date().toISOString().split("T")[0];
        if (record) {
            setEditingId(record.backendId ?? record.id ?? record.performanceId ?? null);
            setFormData({
                employeeId: String(
                    record.employee?.id ?? record.employeeId ?? record.employee?.employeeId ?? ""
                ),
                reviewPeriod: record.reviewPeriod || today,
                reviewer: record.reviewer || "",
                technicalSkill: String(record.technicalSkill ?? 5),
                communication: String(record.communication ?? 5),
                teamwork: String(record.teamwork ?? 5),
                punctuality: String(record.punctuality ?? 5),
                problemSolving: String(record.problemSolving ?? 5),
                leadership: String(record.leadership ?? 5),
                remarks: record.remarks || ""
            });
        } else {
            setEditingId(null);
            setFormData({
                employeeId: "",
                reviewPeriod: today,
                reviewer: getCurrentUser(),
                technicalSkill: "5",
                communication: "5",
                teamwork: "5",
                punctuality: "5",
                problemSolving: "5",
                leadership: "5",
                remarks: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingId(null);
        setFormError("");
    };

    const handleSave = async () => {
        try {
            setFormError("");
            const employeeId = Number(formData.employeeId);
            if (!employeeId || isNaN(employeeId)) {
                setFormError("Employee ID is required.");
                return;
            }

            if (!formData.reviewPeriod || formData.reviewPeriod.trim() === "") {
                setFormError("Review Period is required.");
                return;
            }

            if (!formData.reviewer || formData.reviewer.trim() === "") {
                setFormError("Reviewer name is required.");
                return;
            }

            const payload = {
                employeeId,
                employee: { id: employeeId },
                reviewPeriod: formData.reviewPeriod,
                reviewer: formData.reviewer,
                technicalSkill: Number(formData.technicalSkill) || 5,
                communication: Number(formData.communication) || 5,
                teamwork: Number(formData.teamwork) || 5,
                punctuality: Number(formData.punctuality) || 5,
                problemSolving: Number(formData.problemSolving) || 5,
                leadership: Number(formData.leadership) || 5,
                remarks: formData.remarks || ""
            };

            if (editingId) {
                payload.id = editingId;
                await PerformanceService.updatePerformanceReview(editingId, payload);
            } else {
                await PerformanceService.createPerformanceReview(payload);
            }

            handleCloseDialog();
            setFormError("");
            loadPerformance();
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Error saving performance review.";
            setFormError(message);
            console.error("Error saving performance review:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await PerformanceService.deletePerformanceReview(id);
            setDeleteConfirm(null);
            loadPerformance();
        } catch (error) {
            console.error("Error deleting record:", error);
            setFormError("Error deleting record");
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "employeeId",
            headerName: "Employee ID",
            width: 110,
            valueGetter: (params) =>
                params.row?.employeeId ?? params.row?.employee_id ?? params.row?.employee?.id ?? params.row?.employee?.employeeId ?? params.row?.employee?.employee_id ?? ""
        },
        { field: "reviewPeriod", headerName: "Review Period", width: 120 },
        { field: "reviewer", headerName: "Reviewer", width: 120 },
        { field: "technicalSkill", headerName: "Technical Skill", width: 110 },
        { field: "communication", headerName: "Communication", width: 110 },
        { field: "teamwork", headerName: "Teamwork", width: 100 },
        { field: "punctuality", headerName: "Punctuality", width: 110 },
        { field: "problemSolving", headerName: "Problem Solving", width: 120 },
        { field: "leadership", headerName: "Leadership", width: 100 },
        { field: "overallRating", headerName: "Overall Rating", width: 110 },
        { field: "remarks", headerName: "Remarks", flex: 1, minWidth: 150 },
        { field: "reviewDate", headerName: "Review Date", width: 110 },
        {
            field: "actions",
            headerName: "Actions",
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteConfirm(params.row.backendId ?? params.row.id ?? params.row.performanceId ?? null)}
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
                <Typography variant="h5">Performance Management</Typography>
                {pageError && (
                    <Alert severity="error" onClose={() => setPageError("")}>
                        {pageError}
                    </Alert>
                )}
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Review
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadPerformance}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {loading ? (
                <CircularProgress />
            ) : records.length === 0 ? (
                <Typography sx={{ py: 4, textAlign: "center" }}>
                    {pageError ? "Failed to load reviews" : "No performance reviews found"}
                </Typography>
            ) : (
                <DataGrid
                    rows={records}
                    columns={columns}
                    getRowId={(row) => row.id}
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{editingId ? "Edit Performance Review" : "Add Performance Review"}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Employee ID"
                                type="number"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Review Period"
                                type="date"
                                value={formData.reviewPeriod}
                                onChange={(e) => setFormData({ ...formData, reviewPeriod: e.target.value })}
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reviewer Name"
                                value={formData.reviewer}
                                onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Technical Skill (1-10)"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                value={formData.technicalSkill}
                                onChange={(e) => setFormData({ ...formData, technicalSkill: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Communication (1-10)"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                value={formData.communication}
                                onChange={(e) => setFormData({ ...formData, communication: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Teamwork (1-10)"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                value={formData.teamwork}
                                onChange={(e) => setFormData({ ...formData, teamwork: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Punctuality (1-10)"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                value={formData.punctuality}
                                onChange={(e) => setFormData({ ...formData, punctuality: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Problem Solving (1-10)"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                value={formData.problemSolving}
                                onChange={(e) => setFormData({ ...formData, problemSolving: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Leadership (1-10)"
                                type="number"
                                inputProps={{ min: 1, max: 10 }}
                                value={formData.leadership}
                                onChange={(e) => setFormData({ ...formData, leadership: e.target.value })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Remarks"
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        {formError && (
                            <Grid item xs={12}>
                                <Typography color="error" variant="body2">
                                    {formError}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
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
                    <Typography>Are you sure you want to delete this performance review?</Typography>
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
