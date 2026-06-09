import api from "../api/axios";

export const citizenService = {
  create: (data) =>
    api.post("/citizen", data, {
      withCredentials: true,
    }),

  getAll: () =>
    api.get("/citizen", {
      withCredentials: true,
    }),

  getById: (id) =>
    api.get(`/citizen/${id}`, {
      withCredentials: true,
    }),

  update: (id, data) =>
    api.put(`/citizen/${id}`, data, {
      withCredentials: true,
    }),

  delete: (id) =>
    api.delete(`/citizen/${id}`, {
      withCredentials: true,
    }),
};
