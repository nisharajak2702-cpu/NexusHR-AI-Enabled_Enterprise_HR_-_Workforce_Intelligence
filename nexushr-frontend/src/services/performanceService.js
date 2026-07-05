import api from "../api/axios";

const PerformanceService = {
    getPerformanceReviews() {
        return api.get("/performance");
    },

    getPerformanceReview(id) {
        return api.get(`/performance/${id}`);
    },

    createPerformanceReview(review) {
        return api.post("/performance", review);
    },

    updatePerformanceReview(id, review) {
        return api.put(`/performance/${id}`, review);
    },

    deletePerformanceReview(id) {
        return api.delete(`/performance/${id}`);
    },

    getEmployeePerformance(employeeId) {
        return api.get(`/performance/employee/${employeeId}`);
    }
};

export default PerformanceService;
