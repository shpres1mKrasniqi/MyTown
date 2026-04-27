import api from "../api/axios";

export const idScanService = {
  extract: (formData) => api.post("/id-scan/extract", formData),
};
