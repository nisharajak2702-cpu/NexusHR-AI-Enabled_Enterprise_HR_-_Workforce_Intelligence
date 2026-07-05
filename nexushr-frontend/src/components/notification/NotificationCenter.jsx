import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
    Card,
    CardContent,
    CardActions,
    Chip
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../../api/axios";
import NotificationService from "../../services/notificationService";

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, [page, pageSize]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await NotificationService.getNotifications(page, pageSize);
            const payload = response.data?.content ?? response.data?.data ?? response.data ?? [];
            setNotifications(Array.isArray(payload) ? payload : []);
        } catch (error) {
            console.error("Error loading notifications:", error);
            try {
                const fallbackResponse = await api.get("/notifications");
                const fallbackPayload = fallbackResponse.data?.content ?? fallbackResponse.data?.data ?? fallbackResponse.data ?? [];
                setNotifications(Array.isArray(fallbackPayload) ? fallbackPayload : []);
            } catch (fallbackError) {
                console.error("Fallback notification load failed:", fallbackError);
                setNotifications([]);
            }
        }
        setLoading(false);
    };

    const loadUnreadCount = async () => {
        try {
            const response = await NotificationService.getUnreadNotifications();
            const data = response.data;
            const count =
                typeof data === "number"
                    ? data
                    : Array.isArray(data)
                    ? data.length
                    : data?.count ?? data?.unreadCount ?? 0;
            setUnreadCount(count);
        } catch (error) {
            console.error("Error loading unread count:", error);
            setUnreadCount(notifications.filter((n) => !n.isRead).length);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await NotificationService.markAsRead(id);
            loadNotifications();
            loadUnreadCount();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            loadNotifications();
            loadUnreadCount();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await NotificationService.deleteNotification(id);
            loadNotifications();
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await NotificationService.deleteAllNotifications();
            loadNotifications();
            loadUnreadCount();
        } catch (error) {
            console.error("Error deleting all notifications:", error);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Chip label={`${unreadCount} unread`} color="primary" />
                    )}
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Mark All as Read
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeleteAll}
                        disabled={notifications.length === 0}
                    >
                        Delete All
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadNotifications}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Stack>

            {loading ? (
                <CircularProgress />
            ) : notifications.length === 0 ? (
                <Typography color="textSecondary">No notifications</Typography>
            ) : (
                <Stack spacing={2}>
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            sx={{
                                backgroundColor: notification.isRead ? "white" : "#f5f5f5",
                                borderLeft: notification.isRead ? "none" : "4px solid #1976d2"
                            }}
                        >
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h6">{notification.title}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    {!notification.isRead && (
                                        <Chip label="Unread" color="primary" size="small" />
                                    )}
                                </Stack>
                            </CardContent>
                            <CardActions>
                                {!notification.isRead && (
                                    <Button
                                        size="small"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        Mark as Read
                                    </Button>
                                )}
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(notification.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            )}

            <Stack direction="row" justifyContent="center" sx={{ mt: 3, gap: 1 }}>
                <Button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                >
                    Previous
                </Button>
                <Typography sx={{ alignSelf: "center" }}>Page {page + 1}</Typography>
                <Button
                    onClick={() => setPage(page + 1)}
                    disabled={notifications.length < pageSize}
                >
                    Next
                </Button>
            </Stack>
        </Box>
    );
}
