import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Luôn đính kèm Token vào Header mỗi khi gọi API
api.interceptors.request.use(
  (config) => {
    // ĐỔI SANG DÙNG LOCALSTORAGE
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor bổ sung: Tự động logout nếu gặp lỗi 401 (Token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userName"); // Xóa luôn tên
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
