import api from "../api/axios";

export const staffService = {
  getAll: () => api.get("/staff/GetStaffMembers"),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post("/staff/AddStaffMember", data),
  update: (id, data) => api.put(`/staff/${id}/UpdateStaffProfile`, data),
  delete: (id) => api.delete(`/staff/${id}/DeleteStaffProfile`),
};
