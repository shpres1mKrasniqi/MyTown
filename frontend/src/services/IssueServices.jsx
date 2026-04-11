import api from "../api/axios";

export const IssueService = {
  create: (data) => api.post("/issues", data, { withCredentials: true }),
};
