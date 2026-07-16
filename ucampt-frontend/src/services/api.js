import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("API Request interceptor - Token check:", {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + "..." : "NO TOKEN",
    endpoint: config.url
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✓ Token attached to Authorization header");
  } else {
    console.warn("⚠️ WARNING: No token found in localStorage for endpoint:", config.url);
  }
  return config;
});

export default api;