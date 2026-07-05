import api from "../api/axios";

const AttendanceService = {
    getAttendance(page = 0, size = 10, sortBy = "id", direction = "asc") {
        return api.get("/attendance", {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
    },

    getAttendanceRecord(id) {
        return api.get(`/attendance/${id}`);
    },

    checkIn(employeeId, attendanceData = null) {
        return attendanceData
            ? api.post(`/attendance/check-in/${employeeId}`, attendanceData)
            : api.post(`/attendance/check-in/${employeeId}`);
    },

    checkOut(employeeId) {
        return api.post(`/attendance/check-out/${employeeId}`);
    },

    markAttendance(attendance) {
        return AttendanceService.checkIn(attendance.employeeId);
    },

    updateAttendance(id, attendance) {
        return api.put(`/attendance/${id}`, attendance);
    },

    deleteAttendance(id) {
        return api.delete(`/attendance/${id}`);
    },

    getAttendanceByEmployee(employeeId, page = 0, size = 10) {
        return api.get(`/attendance/employee/${employeeId}`, {
            params: {
                page,
                size
            }
        });
    },

    exportExcel() {
        return api.get("/attendance/export/excel", {
            responseType: "blob"
        });
    }
};

export default AttendanceService;
