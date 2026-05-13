import api from "../api/axios";

export const ProposalService = {
  create: (data) =>
    api.post("/ProjectProposal", data, {
      withCredentials: true,
    }),
  getById: (id) => api.get(`/ProjectProposal/${id}`, { withCredentials: true }),
  getAll: () => api.get(`/ProjectProposal`, { withCredentials: true }),
  delete: (id) =>
    api.delete(`/ProjectProposal/${id}`, { withCredentials: true }),
  update: (id, data) =>
    api.put(`/ProjectProposal/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }),
};
