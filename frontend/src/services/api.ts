import axios from "axios";

const api = axios.create({
  baseURL: "https://tab-back.raulc.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@TAB:token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("@TAB:token");
      localStorage.removeItem("@TAB:user");

      window.location.href = "/login?sessionExpired=true";
    }

    return Promise.reject(error);
  },
);

export default api;
