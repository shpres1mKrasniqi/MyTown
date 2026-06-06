import api from "../api/axios";

export const departmentService = {
  getAll: () => api.get("/department"),
  getById: (id) => api.get(`/department/${id}`),
  create: (data) => api.post("/department", data, { withCredentials: true }),
  update: (id, data) =>
    api.put(`/department/${id}`, data, { withCredentials: true }),
  delete: (id) => api.delete(`/department/${id}`, { withCredentials: true }),
  search: (params) => api.get("/AdvancedSearch/departments", { params }),
};
