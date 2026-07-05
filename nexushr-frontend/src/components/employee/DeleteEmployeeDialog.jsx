import {

    Dialog,

    DialogTitle,

    DialogContent,

    DialogActions,

    Button,

    Typography

} from "@mui/material";

export default function DeleteEmployeeDialog({

    open,

    onClose,

    onDelete

}) {

    return (

        <Dialog
            open={open}
            onClose={onClose}
        >

            <DialogTitle>

                Delete Employee

            </DialogTitle>

            <DialogContent>

                <Typography>

                    Are you sure you want to delete this employee?

                </Typography>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button

                    color="error"

                    variant="contained"

                    onClick={onDelete}

                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

}