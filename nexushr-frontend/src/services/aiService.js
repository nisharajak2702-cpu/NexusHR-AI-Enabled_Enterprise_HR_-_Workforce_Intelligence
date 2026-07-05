import api from "../api/axios";
import AttendanceService from "./attendanceService";
import PerformanceService from "./performanceService";
import LeaveService from "./leaveService";
import EmployeeService from "./employeeService";

const getArrayFromData = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.content) return data.content;
    if (data?.data) return data.data;
    return [];
};

const safeNumber = (value, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

const normalizeRating = (record) =>
    record?.overallRating ?? record?.averageRating ?? record?.rating ?? record?.performanceRating ?? record?.reviewRating ?? null;

const computeAttendanceTrend = (attendanceRecords = []) => {
    const trendMap = {};
    attendanceRecords.forEach((record) => {
        const dateValue = record?.date ?? record?.attendanceDate ?? record?.createdAt;
        if (!dateValue) return;
        const parsed = new Date(dateValue);
        if (Number.isNaN(parsed.getTime())) return;
        const month = parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        trendMap[month] = (trendMap[month] || 0) + 1;
    });

    return Object.entries(trendMap)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([month, count]) => ({ month, percentage: count }));
};

const computePerformanceDistribution = (reviews = []) => {
    const distribution = {};
    reviews.forEach((review) => {
        const rating = normalizeRating(review);
        if (rating == null || rating === "") return;
        const key = String(rating);
        distribution[key] = (distribution[key] || 0) + 1;
    });
    return distribution;
};

const getLeaveMetrics = (leaveRequests = []) => {
    const metrics = {
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        averageDuration: 0
    };

    const durations = [];
    leaveRequests.forEach((leave) => {
        metrics.totalRequests += 1;
        const status = (leave?.status ?? leave?.leaveStatus ?? "").toString().toUpperCase();
        if (status === "PENDING") {
            metrics.pendingRequests += 1;
        } else if (status === "APPROVED") {
            metrics.approvedRequests += 1;
        } else if (status === "REJECTED") {
            metrics.rejectedRequests += 1;
        }

        const fromDate = new Date(leave?.fromDate ?? leave?.startDate);
        const toDate = new Date(leave?.toDate ?? leave?.endDate);
        if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime())) {
            durations.push(Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1);
        }
    });

    if (durations.length > 0) {
        metrics.averageDuration = Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length);
    }

    return metrics;
};

const getKeyInsights = ({ attendanceAnalytics, performanceAnalytics, leaveAnalytics }) => {
    const insights = [];

    if (attendanceAnalytics?.averageAttendance != null) {
        insights.push(`Average attendance is ${attendanceAnalytics.averageAttendance}%`);
    }
    if (performanceAnalytics?.averageRating != null) {
        insights.push(`Average performance rating is ${performanceAnalytics.averageRating}`);
    }
    if (leaveAnalytics?.pendingRequests != null) {
        insights.push(`${leaveAnalytics.pendingRequests} leave requests are pending`);
    }
    if (leaveAnalytics?.approvedRequests != null) {
        insights.push(`${leaveAnalytics.approvedRequests} leaves approved`);
    }

    return insights.length > 0 ? insights : ["No insights available yet"];
};

const AIService = {
    getWorkforceInsights() {
        return api.get("/ai/workforce-insights");
    },

    getEmployeeAnalytics(employeeId) {
        return api.get(`/ai/employee-analytics/${employeeId}`);
    },

    getPredictiveAnalytics() {
        return api.get("/ai/predictive-analytics");
    },

    getAttendanceAnalytics() {
        return api.get("/ai/attendance-analytics");
    },

    getPerformanceAnalytics() {
        return api.get("/ai/performance-analytics");
    },

    getLeaveAnalytics() {
        return api.get("/ai/leave-analytics");
    },

    generateReport(type, params) {
        return api.get(`/ai/report/${type}`, {
            params
        });
    },

    async getDashboardFallbackData() {
        const [employeeRes, attendanceRes, performanceRes, leaveRes] = await Promise.all([
            EmployeeService.getEmployees(0, 1000),
            AttendanceService.getAttendance(0, 1000),
            PerformanceService.getPerformanceReviews(),
            LeaveService.getLeaveRequests(0, 1000)
        ]);

        const employees = getArrayFromData(employeeRes.data);
        const attendanceRecords = getArrayFromData(attendanceRes.data);
        const performanceReviews = getArrayFromData(performanceRes.data);
        const leaveRequests = getArrayFromData(leaveRes.data);

        const employeeCount = employeeRes.data?.totalElements ?? (Array.isArray(employees) ? employees.length : 0);
        const today = new Date().toISOString().slice(0, 10);
        const todayAttendanceCount = attendanceRecords.filter((record) => {
            const dateValue = record?.date ?? record?.attendanceDate ?? record?.createdAt;
            if (!dateValue) return false;
            const parsed = new Date(dateValue);
            return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === today;
        }).length;

        const averageAttendance = employeeCount > 0 ? Number(((todayAttendanceCount / employeeCount) * 100).toFixed(1)) : null;

        const ratings = performanceReviews
            .map(normalizeRating)
            .filter((rating) => rating != null && rating !== "")
            .map((rating) => safeNumber(rating));
        const averageRating = ratings.length > 0 ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)) : null;

        const attendanceAnalytics = {
            averageAttendance,
            trend: computeAttendanceTrend(attendanceRecords)
        };

        const performanceAnalytics = {
            averageRating,
            distribution: computePerformanceDistribution(performanceReviews)
        };

        const leaveAnalytics = getLeaveMetrics(leaveRequests);

        return {
            workforceInsights: {
                insights: getKeyInsights({ attendanceAnalytics, performanceAnalytics, leaveAnalytics })
            },
            attendanceAnalytics,
            performanceAnalytics,
            leaveAnalytics
        };
    }
};

export default AIService;
