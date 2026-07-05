import { useEffect, useState } from "react";

import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Alert
} from "@mui/material";

import {
    DataGrid
} from "@mui/x-data-grid";

import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import EmployeeService from "../../services/employeeService";

export default function EmployeeTable() {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(0);

    const [pageSize, setPageSize] = useState(10);

    const [rowCount, setRowCount] = useState(0);

    const [sortModel, setSortModel] = useState([
        {
            field: "id",
            sort: "asc"
        }
    ]);

    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        salary: "",
        hireDate: "",
        departmentId: ""
    });

    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const [openAddDialog, setOpenAddDialog] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {

        loadEmployees();

    }, [page, pageSize, sortModel]);

    const loadEmployees = async () => {

        setLoading(true);

        try {

            const response =
                await EmployeeService.getEmployees(

                    page,

                    pageSize,

                    sortModel[0]?.field || "id",

                    sortModel[0]?.sort || "asc"

                );

            const payload = response.data?.content ?? response.data?.data ?? response.data ?? [];
            setEmployees(Array.isArray(payload) ? payload : []);
            setRowCount(response.data?.totalElements ?? (Array.isArray(payload) ? payload.length : 0));

        } catch (error) {

            console.error(error);

        }

        setLoading(false);

    };

    const handleSearch = async () => {

        if (search.trim() === "") {

            loadEmployees();

            return;

        }

        setLoading(true);

        try {

            const response =
                await EmployeeService.searchEmployees(
                    search,
                    page,
                    pageSize
                );

            const payload = response.data?.content ?? response.data?.data ?? response.data ?? [];
            setEmployees(Array.isArray(payload) ? payload : []);
            setRowCount(response.data?.totalElements ?? (Array.isArray(payload) ? payload.length : 0));

        } catch (error) {

            console.error(error);

        }

        setLoading(false);

    };

    const downloadExcel = async () => {

        try {

            const response =
                await EmployeeService.exportExcel();

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "employees.xlsx"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

        } catch (e) {

            console.error(e);

        }

    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setFormData({
            firstName: employee.firstName || "",
            lastName: employee.lastName || "",
            email: employee.email || "",
            phone: employee.phone || "",
            position: employee.position || "",
            salary: employee.salary || "",
            hireDate: employee.hireDate || "",
            departmentId: employee.departmentId || ""
        });
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setSelectedEmployee(null);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            position: "",
            salary: "",
            hireDate: "",
            departmentId: ""
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEmployee = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setErrorMessage("First Name, Last Name, and Email are required");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await EmployeeService.updateEmployee(selectedEmployee.id, formData);
            setSuccessMessage("Employee updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            handleEditDialogClose();
            loadEmployees();
        } catch (error) {
            console.error("Error updating employee:", error);
            setErrorMessage(error.response?.data?.message || "Error updating employee. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (employeeId) => {
        setDeleteConfirmation(employeeId);
    };

    const handleDeleteConfirm = async () => {
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await EmployeeService.deleteEmployee(deleteConfirmation);
            setSuccessMessage("Employee deleted successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            setDeleteConfirmation(null);
            loadEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
            setErrorMessage(error.response?.data?.message || "Error deleting employee. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation(null);
    };

    const handleAddClick = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            position: "",
            salary: "",
            hireDate: "",
            departmentId: ""
        });
        setSelectedEmployee(null);
        setOpenAddDialog(true);
        setErrorMessage("");
    };

    const handleAddDialogClose = () => {
        setOpenAddDialog(false);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            position: "",
            salary: "",
            hireDate: "",
            departmentId: ""
        });
        setErrorMessage("");
    };

    const handleAddEmployee = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setErrorMessage("First Name, Last Name, and Email are required");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await EmployeeService.createEmployee(formData);
            setSuccessMessage("Employee created successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            handleAddDialogClose();
            loadEmployees();
        } catch (error) {
            console.error("Error creating employee:", error);
            setErrorMessage(error.response?.data?.message || "Error creating employee. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 80
        },

        {
            field: "firstName",
            headerName: "First Name",
            flex: 1
        },

        {
            field: "lastName",
            headerName: "Last Name",
            flex: 1
        },

        {
            field: "email",
            headerName: "Email",
            flex: 1.5
        },

        {
            field: "phone",
            headerName: "Phone",
            flex: 1
        },

        {
            field: "position",
            headerName: "Position",
            flex: 1
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 180,

            sortable: false,

            renderCell: (params) => (

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button

                        variant="outlined"

                        size="small"

                        startIcon={<EditIcon />}

                        onClick={() => handleEditClick(params.row)}

                    >

                        Edit

                    </Button>

                    <Button

                        variant="outlined"

                        color="error"

                        size="small"

                        startIcon={<DeleteIcon />}

                        onClick={() => handleDeleteClick(params.row.id)}

                    >

                        Delete

                    </Button>

                </Stack>

            )

        }

    ];

    return (

        <Box>

            <Typography
                variant="h4"
                mb={3}
            >

                Employee Management

            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            <Stack
                direction="row"
                spacing={2}
                mb={2}
            >

                <TextField

                    label="Search Employee"

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                />

                <Button

                    variant="contained"

                    onClick={handleSearch}

                >

                    Search

                </Button>

                <Button

                    variant="contained"

                    color="success"

                    startIcon={<RefreshIcon />}

                    onClick={loadEmployees}

                >

                    Refresh

                </Button>

                <Button

                    variant="contained"

                    startIcon={<AddIcon />}

                    onClick={handleAddClick}

                >

                    Add Employee

                </Button>

                <Button

                    variant="contained"

                    color="secondary"

                    startIcon={<DownloadIcon />}

                    onClick={downloadExcel}

                >

                    Excel

                </Button>

            </Stack>

            {loading ?

                (

                    <CircularProgress />

                )

                :

                (

                    <div
                        style={{
                            height: 600,
                            width: "100%"
                        }}
                    >

                        <DataGrid

                            rows={employees}

                            columns={columns}

                            pagination

                            paginationMode="server"

                            sortingMode="server"

                            rowCount={rowCount}

                            pageSizeOptions={[5, 10, 20]}

                            paginationModel={{
                                page,
                                pageSize
                            }}

                            onPaginationModelChange={(model) => {

                                setPage(model.page);

                                setPageSize(model.pageSize);

                            }}

                            sortModel={sortModel}

                            onSortModelChange={(model) => {

                                if (model.length > 0) {

                                    setSortModel(model);

                                }

                            }}

                        />

                    </div>

                )

            }

            <Dialog
                open={openEditDialog}
                onClose={handleEditDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Edit Employee - {selectedEmployee?.id}
                </DialogTitle>

                <DialogContent sx={{ pt: 2 }}>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormChange}
                                error={formData.firstName === ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormChange}
                                error={formData.lastName === ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                error={formData.email === ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Position"
                                name="position"
                                value={formData.position}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={handleFormChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Department ID"
                                name="departmentId"
                                type="number"
                                value={formData.departmentId}
                                onChange={handleFormChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleEditDialogClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveEmployee}
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAddDialog}
                onClose={handleAddDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Add New Employee
                </DialogTitle>

                <DialogContent sx={{ pt: 2 }}>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleFormChange}
                                error={formData.firstName === ""}
                                helperText={formData.firstName === "" ? "Required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleFormChange}
                                error={formData.lastName === ""}
                                helperText={formData.lastName === "" ? "Required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                error={formData.email === ""}
                                helperText={formData.email === "" ? "Required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Position"
                                name="position"
                                value={formData.position}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={handleFormChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Department ID"
                                name="departmentId"
                                type="number"
                                value={formData.departmentId}
                                onChange={handleFormChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleAddDialogClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddEmployee}
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteConfirmation !== null}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Are you sure you want to delete this employee? This action cannot be undone.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>

    );

}