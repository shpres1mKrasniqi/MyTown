import api from "../api/axios";

export const ProposalService = {
  create: (data) =>
    api.post("/ProjectProposal", data, {
      withCredentials: true,
    }),
};
