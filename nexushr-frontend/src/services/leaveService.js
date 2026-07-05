import api from "../api/axios";

const LeaveService = {
    getLeaveRequests(page = 0, size = 10, sortBy = "id", direction = "asc") {
        return api.get("/leave", {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
    },

    getLeaveRequest(id) {
        return api.get(`/leave/${id}`);
    },

    createLeaveRequest(leaveRequest) {
        return api.post("/leave/apply", leaveRequest);
    },

    updateLeaveRequest(id, leaveRequest) {
        return api.put(`/leave/${id}`, leaveRequest);
    },

    deleteLeaveRequest(id) {
        return api.delete(`/leave/${id}`);
    },

    approveLeave(id) {
        return api.put(`/leave/approve/${id}`);
    },

    rejectLeave(id, reason) {
        return api.put(`/leave/reject/${id}`, { reason });
    },

    getMyLeaveRequests(employeeId, page = 0, size = 10) {
        return api.get(`/leave/employee/${employeeId}`, {
            params: {
                page,
                size
            }
        });
    },

    exportExcel() {
        return api.get("/leave/export/excel", {
            responseType: "blob"
        });
    }
};

export default LeaveService;
