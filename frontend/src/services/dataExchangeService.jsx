import api from "../api/axios";

export const dataExchangeService = {
  exportData: (entityType, format) =>
    api.get(`/DataExchange/export/${entityType}/${format}`, {
      responseType: "blob",
      withCredentials: true,
    }),

  importData: (entityType, format, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(
      `/DataExchange/import/${entityType}/${format}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
  },
};
