import React, { useEffect, useState, cloneElement } from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    CircularProgress,
    Stack,
    Button
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleIcon from "@mui/icons-material/People";
import AttendanceIcon from "@mui/icons-material/CheckCircle";
import LeaveIcon from "@mui/icons-material/EventNote";
import PaymentIcon from "@mui/icons-material/Payment";
import EmployeeService from "../../services/employeeService";
import AttendanceService from "../../services/attendanceService";
import LeaveService from "../../services/leaveService";
import PayrollService from "../../services/payrollService";

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        todayAttendance: 0,
        pendingLeaves: 0,
        totalPayroll: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        setLoading(true);
        try {
            const calls = [
                EmployeeService.getEmployees(0, 1),
                AttendanceService.getAttendance(0, 1),
                LeaveService.getLeaveRequests(0, 1),
                PayrollService.getPayroll(0, 1)
            ];

            const results = await Promise.allSettled(calls);

            const unwrap = (r) => (r && r.status === 'fulfilled' ? r.value : null);

            const empRes = unwrap(results[0]);
            const attRes = unwrap(results[1]);
            const leaveRes = unwrap(results[2]);
            const payrollRes = unwrap(results[3]);

            const extractCount = (res) => {
                if (!res || res.data == null) return 0;
                const d = res.data;
                if (typeof d === 'number') return d;
                if (Array.isArray(d)) return d.length;
                if (typeof d === 'object') {
                    if (typeof d.totalElements === 'number') return d.totalElements;
                    if (Array.isArray(d.content)) return d.content.length;
                    if (Array.isArray(d.data)) return d.data.length;
                }
                return 0;
            };

            setStats({
                totalEmployees: extractCount(empRes),
                todayAttendance: extractCount(attRes),
                pendingLeaves: extractCount(leaveRes),
                totalPayroll: extractCount(payrollRes)
            });
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
        setLoading(false);
    };

    const StatCard = ({ icon, title, value, color }) => (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography color="textSecondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ color }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box>
                        {icon
                            ? React.isValidElement(icon)
                                ? cloneElement(icon, { sx: { fontSize: 48, color, opacity: 0.3 } })
                                : icon
                            : null}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ width: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h5">Dashboard Overview</Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={loadDashboardStats}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Stack>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<PeopleIcon />}
                            title="Total Employees"
                            value={stats.totalEmployees}
                            color="#1976d2"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<AttendanceIcon />}
                            title="Today's Attendance"
                            value={stats.todayAttendance}
                            color="#388e3c"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<LeaveIcon />}
                            title="Pending Leave Requests"
                            value={stats.pendingLeaves}
                            color="#f57c00"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<PaymentIcon />}
                            title="Active Payroll Records"
                            value={stats.totalPayroll}
                            color="#7b1fa2"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Quick Stats
                                </Typography>
                                <Stack spacing={2}>
                                    <Typography variant="body2">
                                        Your organization has <strong>{stats.totalEmployees}</strong> employees in the system.
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>{stats.pendingLeaves}</strong> leave requests are awaiting approval.
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>{stats.totalPayroll}</strong> payroll records are active.
                                    </Typography>
                                    <Typography variant="body2">
                                        Attendance for today: <strong>{stats.todayAttendance}</strong> employees marked.
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    System Information
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography variant="body2">
                                        Last updated: {new Date().toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Backend API: http://localhost:8080
                                    </Typography>
                                    <Typography variant="body2">
                                        Frontend Running: http://localhost:5173
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
