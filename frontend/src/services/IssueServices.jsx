import api from "../api/axios";

export const IssueService = {
  create: (data) => api.post("/issues", data, { withCredentials: true }),
  getAll: () => api.get("/issues", { withCredentials: true }),
  getById: (id) => api.get(`/issues/${id}`, { withCredentials: true }),
  // update: (id, data) =>
  //   api.put(`/issues/${id}`, data, { withCredentials: true }),
  delete: (id) => api.delete(`/issues/${id}`, { withCredentials: true }),

  search: (params) =>
    api.get("/AdvancedSearch/issues", {
      params,
      withCredentials: true,
    }),

  getLikes: (issueId) =>
    api.get(`/issues/${issueId}/likes`, { withCredentials: true }),
  toggleLike: (issueId) =>
    api.post(`/issues/${issueId}/likes/toggle`, {}, { withCredentials: true }),
  getComments: (issueId) =>
    api.get(`/issues/${issueId}/comments`, { withCredentials: true }),
  addComment: (issueId, content) =>
    api.post(
      `/issues/${issueId}/comments`,
      { content },
      { withCredentials: true },
    ),

  updateDetails: (id, formData) =>
    api.put(`/Issues/${id}/details`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }),

  updateStatus: (id, data) =>
    api.patch(`/Issues/${id}/status`, data, {
      withCredentials: true,
    }),
};
