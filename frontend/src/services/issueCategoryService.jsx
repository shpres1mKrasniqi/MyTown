import api from "../api/axios";

export const issueCategoryService = {
  create: (data) => api.post("/IssueCategory", data, { withCredentials: true }),

  getAll: () => api.get("/IssueCategory", { withCredentials: true }),
  getById: (id) => api.get(`/IssueCategory/${id}`, { withCredentials: true }),
};