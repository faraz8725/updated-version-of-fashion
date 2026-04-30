import axios from "axios";

//const api = axios.create({ baseURL: "/api" });

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});


// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => api.post("/auth/signup", data).then((r) => r.data);
export const login = (data) => api.post("/auth/login", data).then((r) => r.data);
export const getProfile = () => api.get("/auth/profile").then((r) => r.data);

export default api;
