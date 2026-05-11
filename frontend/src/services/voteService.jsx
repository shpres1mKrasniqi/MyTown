import api from "../api/axios";

export const ProposalVoteService = {
  vote: (projectProposalId, voteType) =>
    api.post(`/Votes/${projectProposalId}/vote`, voteType, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }),

  getVotes: (projectProposalId) =>
    api.get(`/Votes/${projectProposalId}`, {
      withCredentials: true,
    }),
};
