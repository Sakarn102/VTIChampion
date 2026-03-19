import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // QUAN TRỌNG: Để nhận và gửi Cookie (refreshToken) từ Java
});

// 1. Trước khi gửi request: Đính kèm Token vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Sau khi nhận response: Bóc tách dữ liệu và bắt lỗi
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Lỗi hệ thống, vui lnogf thử lại!";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(message);
  },
);

export default axiosClient;
