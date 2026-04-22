import api from "../api/axios";

export const notificationService = {
    getAll: () => api.get("/notification", {withCredentials: true}),
    markAsRead: (id) => api.put(`/notification/${id}/read`, {}, {withCredentials:true}),
    markAllAsRead: () => api.put("/notification/read-all", {}, {withCredentials:true}),
};