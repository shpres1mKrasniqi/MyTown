import api from "../api/axios";

export const ProposalService = {
  create: (data) =>
    api.post("/ProjectProposal", data, {
      withCredentials: true,
    }),
  getById: (id) => api.get(`/ProjectProposal/${id}`, { withCredentials: true }),
  getAll: () => api.get(`/ProjectProposal`, { withCredentials: true }),
};
