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
    Input,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import DocumentService from "../../services/documentService";
import EmployeeService from "../../services/employeeService";

export default function DocumentTable() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ employeeId: "", documentName: "", documentType: "" });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadDocuments();
    }, [page, pageSize, sortModel]);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const response = await EmployeeService.getEmployees(0, 100);
                setEmployees(response.data?.content ?? response.data?.data ?? []);
            } catch (error) {
                console.error("Error loading employee list:", error);
            }
        };

        loadEmployees();
    }, []);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const response = await DocumentService.getDocuments(
                page,
                pageSize,
                sortModel[0]?.field || "id",
                sortModel[0]?.sort || "asc"
            );
            const data = response.data?.content ?? response.data?.data ?? [];
            setDocuments(data);
            setRowCount(response.data?.totalElements ?? data.length);
        } catch (error) {
            console.error("Error loading documents:", error);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        if (search.trim() === "") {
            loadDocuments();
            return;
        }
        setLoading(true);
        try {
            const response = await DocumentService.searchDocuments(search, page, pageSize);
            const data = response.data?.content ?? response.data?.data ?? [];
            setDocuments(data);
            setRowCount(response.data?.totalElements ?? data.length);
        } catch (error) {
            console.error("Error searching documents:", error);
        }
        setLoading(false);
    };

    const handleOpenDialog = () => {
        setSelectedFile(null);
        setFormData({ employeeId: "", documentName: "", documentType: "" });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error("Please select a file");
            return;
        }

        const employeeId = Number(formData.employeeId);
        if (!employeeId || isNaN(employeeId)) {
            console.error("Employee ID is required.");
            return;
        }

        if (!formData.documentType || formData.documentType.trim() === "") {
            console.error("Document Type is required.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("file", selectedFile);

            await DocumentService.uploadDocument(formDataToSend, employeeId, formData.documentType);
            handleCloseDialog();
            loadDocuments();
        } catch (error) {
            console.error("Error uploading document:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await DocumentService.deleteDocument(id);
            setDeleteConfirm(null);
            loadDocuments();
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    const downloadDocument = async (id, name) => {
        try {
            const response = await DocumentService.downloadDocument(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading document:", error);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "documentName", headerName: "Document Name", flex: 1 },
        { field: "documentType", headerName: "Type", width: 120 },
        { field: "uploadedDate", headerName: "Uploaded Date", width: 150 },
        { field: "uploadedBy", headerName: "Uploaded By", width: 130 },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={() => downloadDocument(params.row.id, params.row.documentName)}
                    >
                        Download
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
                <Typography variant="h5">Document Management</Typography>
                <Stack direction="row" spacing={2}>
                    <TextField
                        placeholder="Search documents..."
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
                        onClick={handleOpenDialog}
                    >
                        Upload Document
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadDocuments}
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
                    rows={documents}
                    columns={columns}
                    pagination
                    paginationModel={{ pageSize, page }}
                    pageSizeOptions={[10, 25, 50]}
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
                <DialogTitle>Upload Document</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="employee-select-label">Employee</InputLabel>
                        <Select
                            labelId="employee-select-label"
                            label="Employee"
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        >
                            <MenuItem value="">Select Employee</MenuItem>
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={String(employee.id)}>
                                    {employee.firstName} {employee.lastName} ({employee.id})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Document Type"
                        value={formData.documentType}
                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Document Name"
                        value={formData.documentName}
                        onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                        margin="normal"
                    />
                    <Box sx={{ mt: 2 }}>
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            fullWidth
                        />
                        {selectedFile && (
                            <Chip
                                label={selectedFile.name}
                                onDelete={() => setSelectedFile(null)}
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleUpload} variant="contained">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this document?</Typography>
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
