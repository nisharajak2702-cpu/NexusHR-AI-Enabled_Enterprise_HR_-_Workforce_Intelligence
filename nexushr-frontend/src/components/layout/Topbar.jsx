import {

    AppBar,

    Toolbar,

    Typography,

    Button

} from "@mui/material";

import { useAuth } from "../../context/AuthContext";

export default function Topbar() {

    const { user, logout } = useAuth();

    return (

        <AppBar

            position="fixed"

            sx={{

                zIndex: 1201

            }}

        >

            <Toolbar>

                <Typography

                    variant="h6"

                    sx={{

                        flexGrow: 1

                    }}

                >

                    Nexus HR

                </Typography>

                <Typography

                    sx={{

                        marginRight: 2

                    }}

                >

                    {user?.username}

                </Typography>

                <Button

                    color="inherit"

                    onClick={logout}

                >

                    Logout

                </Button>

            </Toolbar>

        </AppBar>

    );

}