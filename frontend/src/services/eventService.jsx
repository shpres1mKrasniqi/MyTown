import api from "../api/axios";


export const eventService = {
    create: (data) => api.post("/events", data, {withCredentials:true}),
    getAll: () => api.get("/events", {withCredentials:true}),
    getById: (id) => api.get(`/events/${id}`,{withCredentials:true}),
    delet: (id) => api.delete(`/events/${id}`,{withCredentials:true}),
    publish: (id) =>api.post(`/events/${id}/publish`, {}, {withCredentials:true}),
    getReactions: (eventId) => api.get(`/events/${eventId}/reactions`, { withCredentials: true }),
    toggleReaction: (eventId, reactionType) => api.post(`/events/${eventId}/reactions`, { reactionType }, { withCredentials: true }),
}