import api from "../api/axios";

export const constructionPermitsService = {
  create: (data) =>
    api.post("/ConstructionPermitRequest", data, { withCredentials: true }),

  getAll: () =>
    api.get("/ConstructionPermitRequest", { withCredentials: true }),

  getById: (id) =>
    api.get(`/ConstructionPermitRequest/${id}`, { withCredentials: true }),

  updateStatus: (id, data) =>
    api.put(`/ConstructionPermitRequest/${id}`, data, {
      withCredentials: true,
    }),

  deleteSoft: (id) =>
    api.delete(`/ConstructionPermitRequest/${id}`, { withCredentials: true }),
};
