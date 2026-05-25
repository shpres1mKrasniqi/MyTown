import api from "../api/axios";

export const meetingService = {
  create: (data) =>
    api.post("/MeetingRequest", data, { withCredentials: true }),

  getAll: () => api.get("/MeetingRequest", { withCredentials: true }),

  getById: (id) => api.get(`/MeetingRequest/${id}`, { withCredentials: true }),

  updateStatus: (id, data) =>
    api.put(`/MeetingRequest/${id}`, data, { withCredentials: true }),

  deleteSoft: (id) =>
    api.delete(`/MeetingRequest/${id}`, { withCredentials: true }),
};
