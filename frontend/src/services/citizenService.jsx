import api from "../api/axios";

export const citizenService = {
  create: (data) => api.post("/citizen", data),
  getAll: () => api.get("/citizen"),
  getById: (id) => api.get(`/citizen/${id}`),
};
