import api from "../api/axios";

export const komunaService = {

    getAll: () => api.get('/Komuna'),
    getById: (id) => api.get(`/Komuna/${id}`),
    create: (data) => api.post('/Komuna', data, { withCredentials: true }),
    update: (id, data) => api.put(`/Komuna/${id}`, data, { withCredentials: true }),
    delete: (id) => api.delete(`/Komuna/${id}`, { withCredentials: true })

};
