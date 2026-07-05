import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
    Card,
    CardContent,
    Grid
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AIService from "../../services/aiService";

export default function AIInsightsDashboard() {
    const [insights, setInsights] = useState(null);
    const [attendanceAnalytics, setAttendanceAnalytics] = useState(null);
    const [performanceAnalytics, setPerformanceAnalytics] = useState(null);
    const [leaveAnalytics, setLeaveAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAIInsights();
    }, []);

    const loadAIInsights = async () => {
        setLoading(true);
        setError(null);
        setInsights(null);
        setAttendanceAnalytics(null);
        setPerformanceAnalytics(null);
        setLeaveAnalytics(null);

        const requests = [
            AIService.getWorkforceInsights(),
            AIService.getAttendanceAnalytics(),
            AIService.getPerformanceAnalytics(),
            AIService.getLeaveAnalytics()
        ];

        const results = await Promise.allSettled(requests);

        const [insightsResult, attendanceResult, performanceResult, leaveResult] = results;

        let shouldFallback = false;

        if (insightsResult.status === "fulfilled") {
            setInsights(insightsResult.value.data);
        } else {
            shouldFallback = true;
        }

        if (attendanceResult.status === "fulfilled") {
            setAttendanceAnalytics(attendanceResult.value.data);
        } else {
            shouldFallback = true;
        }

        if (performanceResult.status === "fulfilled") {
            setPerformanceAnalytics(performanceResult.value.data);
        } else {
            shouldFallback = true;
        }

        if (leaveResult.status === "fulfilled") {
            setLeaveAnalytics(leaveResult.value.data);
        } else {
            shouldFallback = true;
        }

        if (shouldFallback) {
            try {
                const fallback = await AIService.getDashboardFallbackData();
                if (!insightsResult || insightsResult.status !== "fulfilled") {
                    setInsights(fallback.workforceInsights);
                }
                if (!attendanceResult || attendanceResult.status !== "fulfilled") {
                    setAttendanceAnalytics(fallback.attendanceAnalytics);
                }
                if (!performanceResult || performanceResult.status !== "fulfilled") {
                    setPerformanceAnalytics(fallback.performanceAnalytics);
                }
                if (!leaveResult || leaveResult.status !== "fulfilled") {
                    setLeaveAnalytics(fallback.leaveAnalytics);
                }
            } catch (fallbackError) {
                console.error("AI fallback data load failed:", fallbackError);
            }
        }

        const rejected = results.filter((result) => result.status === "rejected");
        if (rejected.length > 0) {
            const message = rejected
                .map((result, index) => {
                    const endpoint = [
                        "workforce insights",
                        "attendance analytics",
                        "performance analytics",
                        "leave analytics"
                    ][index];
                    const reason = result.status === "rejected" ? result.reason?.message ?? "Failed to load" : "";
                    return `${endpoint}: ${reason}`;
                })
                .join(" | ");
            setError(`Some AI data failed to load: ${message}`);
            console.error("Error loading AI insights:", rejected);
        }

        setLoading(false);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">AI Workforce Insights</Typography>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadAIInsights}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {error && (
                        <Box sx={{ mb: 2 }}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    )}
                    <Grid container spacing={3}>
                    {/* Key Metrics */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Average Attendance
                                </Typography>
                                <Typography variant="h4">
                                    {attendanceAnalytics?.averageAttendance || "N/A"}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Average Performance Rating
                                </Typography>
                                <Typography variant="h4">
                                    {performanceAnalytics?.averageRating || "N/A"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Leave Requests
                                </Typography>
                                <Typography variant="h4">
                                    {leaveAnalytics?.totalRequests || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Pending Approvals
                                </Typography>
                                <Typography variant="h4">
                                    {leaveAnalytics?.pendingRequests || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Insights Summary */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Key Insights
                                </Typography>
                                {error ? (
                                    <Typography variant="body2" color="error">
                                        {error}
                                    </Typography>
                                ) : (
                                    <Stack spacing={1}>
                                        {insights?.insights?.length ? (
                                            insights.insights.map((insight, idx) => (
                                                <Typography key={idx} variant="body2">
                                                    • {insight}
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No insights available yet
                                            </Typography>
                                        )}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Attendance Trends */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Attendance Trend
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Monthly attendance data will be displayed here
                                </Typography>
                                {attendanceAnalytics?.trend && (
                                    <Stack spacing={1} sx={{ mt: 2 }}>
                                        {attendanceAnalytics.trend.map((item, idx) => (
                                            <Typography key={idx} variant="body2">
                                                {item.month}: {item.percentage}%
                                            </Typography>
                                        ))}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Performance Distribution */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Performance Distribution
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Employee performance rating distribution
                                </Typography>
                                {performanceAnalytics?.distribution && (
                                    <Stack spacing={1} sx={{ mt: 2 }}>
                                        {Object.entries(performanceAnalytics.distribution).map(([rating, count]) => (
                                            <Typography key={rating} variant="body2">
                                                Rating {rating}: {count} employees
                                            </Typography>
                                        ))}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Leave Analysis */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Leave Analysis
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography variant="body2">
                                        Approved Leaves: {leaveAnalytics?.approvedRequests || 0}
                                    </Typography>
                                    <Typography variant="body2">
                                        Rejected Leaves: {leaveAnalytics?.rejectedRequests || 0}
                                    </Typography>
                                    <Typography variant="body2">
                                        Average Leave Duration: {leaveAnalytics?.averageDuration || "N/A"} days
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                </>
            )}
        </Box>
    );
}
