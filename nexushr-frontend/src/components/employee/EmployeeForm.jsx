import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid
} from "@mui/material";

const emptyEmployee = {

    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    hireDate: "",
    departmentId: ""

};

export default function EmployeeForm({

    open,

    onClose,

    onSave,

    employee

}) {

    const [formData, setFormData] = useState(emptyEmployee);

    useEffect(() => {

        if (employee) {

            setFormData(employee);

        } else {

            setFormData(emptyEmployee);

        }

    }, [employee]);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = () => {

        onSave(formData);

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {employee ? "Edit Employee" : "Add Employee"}

            </DialogTitle>

            <DialogContent>

                <Grid container spacing={2} mt={1}>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Salary"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            name="hireDate"
                            value={formData.hireDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Department ID"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleChange}
                        />
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Save
                </Button>

            </DialogActions>

        </Dialog>

    );

}