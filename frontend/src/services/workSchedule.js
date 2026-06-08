import api from "../api/axios";

export const workScheduleService = {
  getAll: () => api.get("/WorkSchedule"),
  getById: (id) => api.get(`/WorkSchedule/${id}`),
  create: (data) => api.post("/WorkSchedule", data),
  update: (id, data) => api.put(`/WorkSchedule/${id}`, data),
  delete: (id) => api.delete(`/WorkSchedule/${id}`),
};
