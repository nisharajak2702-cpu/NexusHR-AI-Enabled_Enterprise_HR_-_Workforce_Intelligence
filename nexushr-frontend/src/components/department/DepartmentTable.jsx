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
    Alert,
    Grid
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DepartmentService from "../../services/departmentService";

export default function DepartmentTable() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        loadDepartments();
    }, [page, pageSize, sortModel]);

    const normalizeDepartments = (rows) => {
        const list = Array.isArray(rows) ? rows : [];
        return list.filter((item) => item && item.name != null && item.name !== "");
    };

    const loadDepartments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await DepartmentService.getDepartments(
                page,
                pageSize,
                sortModel[0]?.field || "id",
                sortModel[0]?.sort || "asc"
            );
            console.log("API Response:", response);
            console.log("Response data:", response.data);
            
            // Handle paginated response
            if (response.data && response.data.content) {
                const filtered = normalizeDepartments(response.data.content);
                setDepartments(filtered);
                setRowCount(filtered.length);
            } else if (response.data && Array.isArray(response.data.data)) {
                const filtered = normalizeDepartments(response.data.data);
                setDepartments(filtered);
                setRowCount(filtered.length);
            } else if (Array.isArray(response.data)) {
                const filtered = normalizeDepartments(response.data);
                setDepartments(filtered);
                setRowCount(filtered.length);
            } else {
                console.error("Unexpected response format:", response.data);
                setError("Unexpected API response format");
            }
        } catch (error) {
            console.error("Error loading departments:", error);
            setError(`Error loading departments: ${error.message}`);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        if (search.trim() === "") {
            loadDepartments();
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await DepartmentService.searchDepartments(search, page, pageSize);
            console.log("Search response:", response);
            
            if (response.data && response.data.content) {
                const filtered = normalizeDepartments(response.data.content);
                setDepartments(filtered);
                setRowCount(filtered.length);
            } else if (response.data && Array.isArray(response.data.data)) {
                const filtered = normalizeDepartments(response.data.data);
                setDepartments(filtered);
                setRowCount(filtered.length);
            } else if (Array.isArray(response.data)) {
                const filtered = normalizeDepartments(response.data);
                setDepartments(filtered);
                setRowCount(filtered.length);
            }
        } catch (error) {
            console.error("Error searching departments:", error);
            setError(`Error searching departments: ${error.message}`);
        }
        setLoading(false);
    };

    const handleOpenDialog = (dept = null) => {
        if (dept) {
            setEditingId(dept.id);
            setFormData({ name: dept.name, description: dept.description });
        } else {
            setEditingId(null);
            setFormData({ name: "", description: "" });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingId(null);
        setFormData({ name: "", description: "" });
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await DepartmentService.updateDepartment(editingId, formData);
                setSuccessMessage("Department updated successfully!");
            } else {
                await DepartmentService.createDepartment(formData);
                setSuccessMessage("Department created successfully!");
            }
            setTimeout(() => setSuccessMessage(null), 3000);
            handleCloseDialog();
            loadDepartments();
        } catch (error) {
            console.error("Error saving department:", error);
            setError(`Error saving department: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await DepartmentService.deleteDepartment(id);
            setSuccessMessage("Department deleted successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
            setDeleteConfirm(null);
            loadDepartments();
        } catch (error) {
            console.error("Error deleting department:", error);
            setError(`Error deleting department: ${error.message}`);
        }
    };

    const exportDepartmentsToExcel = (rows) => {
        const header = ["ID", "Department Name", "Description"];
        const lines = [header.join("\t")];
        rows.forEach((row) => {
            if (!row) return;
            const cells = [
                row.id ?? "",
                row.name ?? "",
                row.description ?? ""
            ].map((value) => String(value).replace(/\t/g, " "));
            lines.push(cells.join("\t"));
        });
        const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
            type: "application/vnd.ms-excel"
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "departments.xls");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setSuccessMessage("File downloaded successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const downloadExcel = async () => {
        try {
            const response = await DepartmentService.exportExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "departments.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSuccessMessage("File downloaded successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error downloading file:", error);
            if (departments.length > 0) {
                exportDepartmentsToExcel(departments);
            } else {
                setError(`Error downloading file: ${error.message}`);
            }
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Department Name", flex: 1 },
        { field: "description", headerName: "Description", flex: 1.5 },
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
                <Typography variant="h5">Department Management</Typography>
                
                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}
                
                {successMessage && (
                    <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                        {successMessage}
                    </Alert>
                )}
                
                <Stack direction="row" spacing={2}>
                    <TextField
                        placeholder="Search departments..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        Search
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Department
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
                        onClick={loadDepartments}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {loading ? (
                <CircularProgress />
            ) : departments.length === 0 ? (
                <Alert severity="info">
                    No departments found. Click "Add Department" to create one.
                </Alert>
            ) : (
                <div style={{ height: 600, width: "100%" }}>
                    <DataGrid
                        rows={departments}
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
                        pageSizeOptions={[5, 10, 20]}
                    />
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? "Edit Department" : "Add Department"}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Department Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this department?</Typography>
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
