import axios from "axios";

const api = axios.create({
  baseURL: "https://tab-back.raulc.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
