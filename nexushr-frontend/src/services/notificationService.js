import api from "../api/axios";

const NotificationService = {
    getNotifications(page, size) {
        const config = {};
        const params = {};

        if (page != null) {
            params.page = page;
        }
        if (size != null) {
            params.size = size;
        }

        if (Object.keys(params).length) {
            config.params = params;
        }

        return api.get("/notifications", config);
    },

    getUnreadNotifications() {
        return api.get("/notifications/unread");
    },

    markAsRead(id) {
        return api.put(`/notifications/${id}/read`);
    },

    markAllAsRead() {
        return api.put("/notifications/mark-all-read");
    },

    deleteNotification(id) {
        return api.delete(`/notifications/${id}`);
    },

    deleteAllNotifications() {
        return api.delete("/notifications/delete-all");
    },

    sendNotification(notification) {
        return api.post("/notifications/send", notification);
    }
};

export default NotificationService;
