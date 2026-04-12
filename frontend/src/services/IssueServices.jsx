import api from "../api/axios";

export const IssueService = {
  create: (data) => api.post("/issues", data, { withCredentials: true }),
  getAll: () => api.get("/issues", { withCredentials: true }),
  getById: (id) => api.get(`/issues/${id}`, { withCredentials: true }),
  // update: (id, data) =>
  //   api.put(`/issues/${id}`, data, { withCredentials: true }),
  delete: (id) => api.delete(`/issues/${id}`, { withCredentials: true }),
};
