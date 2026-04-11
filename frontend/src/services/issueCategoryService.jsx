// services/issueCategoryService.js
import api from "../api/axios";

export const issueCategoryService = {
  getAll: () => api.get("/IssueCategory"),
  getById: (id) => api.get(`/IssueCategory/${id}`),
};
