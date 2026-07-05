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
    Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CompanyService from "../../services/companyService";

export default function CompanyTable() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        registrationNumber: ""
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadCompanies();
    }, [page, pageSize, sortModel]);

    const normalizeCompanies = (rows) => {
        return Array.isArray(rows)
            ? rows.map((c) => ({
                  id: c.id ?? c.company_id ?? c.pk ?? null,
                  name: c.name ?? c.company_name ?? c.companyName ?? "",
                  email: c.email ?? "",
                  phone: c.phone ?? c.mobile ?? "",
                  address: c.address ?? c.location ?? "",
                  registrationNumber: c.registrationNumber ?? c.gst_number ?? c.pan_number ?? ""
              }))
            : [];
    };

    const loadCompanies = async () => {
        setLoading(true);
        try {
            const response = await CompanyService.getCompanies(
                page,
                pageSize,
                sortModel[0]?.field || "id",
                sortModel[0]?.sort || "asc"
            );
            const payload = response.data?.content ?? response.data?.data ?? response.data ?? [];
            const normalized = normalizeCompanies(Array.isArray(payload) ? payload : []);
            setCompanies(normalized);
            setRowCount(response.data?.totalElements ?? (Array.isArray(payload) ? payload.length : normalized.length));
        } catch (error) {
            console.error("Error loading companies:", error);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        if (search.trim() === "") {
            loadCompanies();
            return;
        }
        setLoading(true);
        try {
            const response = await CompanyService.searchCompanies(search, page, pageSize);
            const payload = response.data?.content ?? response.data?.data ?? response.data ?? [];
            const normalized = normalizeCompanies(Array.isArray(payload) ? payload : []);
            setCompanies(normalized);
            setRowCount(response.data?.totalElements ?? (Array.isArray(payload) ? payload.length : normalized.length));
        } catch (error) {
            console.error("Error searching companies:", error);
        }
        setLoading(false);
    };

    const handleOpenDialog = (company = null) => {
        if (company) {
            setEditingId(company.id);
            setFormData(company);
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                address: "",
                phone: "",
                email: "",
                registrationNumber: ""
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
            if (editingId) {
                await CompanyService.updateCompany(editingId, formData);
            } else {
                await CompanyService.createCompany(formData);
            }
            handleCloseDialog();
            loadCompanies();
        } catch (error) {
            console.error("Error saving company:", error);
            // Optimistic fallback: add the company locally so user sees it
            if (!editingId) {
                const tempId = Date.now();
                const tempRow = {
                    id: tempId,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    registrationNumber: formData.registrationNumber
                };
                setCompanies((prev) => [tempRow, ...prev]);
                setRowCount((c) => c + 1);
                handleCloseDialog();
                // Inform user the save failed server-side
                alert('Company saved locally but failed to persist to server. Check server logs.');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await CompanyService.deleteCompany(id);
            setDeleteConfirm(null);
            loadCompanies();
        } catch (error) {
            console.error("Error deleting company:", error);
        }
    };

    const downloadExcel = async () => {
        try {
            const response = await CompanyService.exportExcel();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "companies.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Company Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "phone", headerName: "Phone", width: 130 },
        { field: "address", headerName: "Address", flex: 1 },
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
                <Typography variant="h5">Company Management</Typography>
                <Stack direction="row" spacing={2}>
                    <TextField
                        placeholder="Search companies..."
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
                        Add Company
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
                        onClick={loadCompanies}
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
                    rows={companies}
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
                <DialogTitle>{editingId ? "Edit Company" : "Add Company"}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Company Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <TextField
                        fullWidth
                        label="Registration Number"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        margin="normal"
                    />
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
                    <Typography>Are you sure you want to delete this company?</Typography>
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
