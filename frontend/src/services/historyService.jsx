import api from "../api/axios";

export const historyService = {
    getAll: (params) => api.get("/history", {params, withCredentials: true}),


    exportPdf: (params) => api.get("/history/export-pdf", {params,responseType:"blob", withCredentials:true}),
};