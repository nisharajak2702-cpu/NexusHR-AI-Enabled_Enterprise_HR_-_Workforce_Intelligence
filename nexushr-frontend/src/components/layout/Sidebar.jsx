import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Typography,
    Stack
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FolderIcon from "@mui/icons-material/Folder";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 250;

export default function Sidebar() {
    const { user } = useAuth();

    // Role-based menu items
    const allMenuItems = [
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            path: "/",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE", "HR"]
        },
        {
            title: "Employees",
            icon: <PeopleIcon />,
            path: "/employees",
            roles: ["ADMIN", "MANAGER", "HR"]
        },
        {
            title: "Departments",
            icon: <BusinessIcon />,
            path: "/departments",
            roles: ["ADMIN", "HR"]
        },
        {
            title: "Attendance",
            icon: <EventAvailableIcon />,
            path: "/attendance",
            roles: ["ADMIN", "MANAGER", "HR"]
        },
        {
            title: "Leave",
            icon: <BeachAccessIcon />,
            path: "/leave",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE", "HR"]
        },
        {
            title: "Payroll",
            icon: <PaymentsIcon />,
            path: "/payroll",
            roles: ["ADMIN", "HR"]
        },
        {
            title: "Performance",
            icon: <AssessmentIcon />,
            path: "/performance",
            roles: ["ADMIN", "MANAGER", "HR"]
        },
        {
            title: "Documents",
            icon: <FolderIcon />,
            path: "/documents",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE", "HR"]
        },
        {
            title: "Notifications",
            icon: <NotificationsIcon />,
            path: "/notifications",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE", "HR"]
        },
        {
            title: "AI Insights",
            icon: <PsychologyIcon />,
            path: "/ai",
            roles: ["ADMIN", "MANAGER", "HR"]
        },
        {
            title: "Company",
            icon: <AdminPanelSettingsIcon />,
            path: "/company",
            roles: ["ADMIN", "HR"]
        }
    ];

    // Filter menu items based on user role
    const menu = allMenuItems.filter(item =>
        item.roles.includes(user?.role?.toUpperCase())
    );

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
        >
            <Toolbar />

            <Stack sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                    Logged in as
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {user?.username}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Role: {user?.role}
                </Typography>
            </Stack>

            <Divider />

            <List>
                {menu.map((item) => (
                    <ListItemButton
                        key={item.title}
                        component={Link}
                        to={item.path}
                        sx={{
                            "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.08)"
                            }
                        }}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.title}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
}