import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7214/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const refreshTokens = async () => {
  console.log("🔄 Refresh token request START");

  if (isRefreshing) {
    console.log("⏳ Already refreshing, queueing request...");
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    console.log("Jena kah e thirrum refreshtokenin...");
    await api.post("/auth/refresh");

    console.log("Refresh token erdhi");
    processQueue(null);
  } catch (err) {
    console.log("Refresh token spo ben");
    processQueue(err);
    window.location.href = "/login";
    throw err;
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh")) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshTokens();
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
