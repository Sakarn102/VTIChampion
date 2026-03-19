import axios from "axios";
import axiosClient from "../axiosClient";

const authApi = {
  login: (params) => {
    // params truyền vào là: { usernameOrEmail: '...', password: '...', rememberMe: true/false }
    return axiosClient.post(`/auth/login`, params);
  },

  // API Đăng Ký
  register: (data) => {
    return axiosClient.post(`/auth/register`, data);
  },

  // verify
  verifyCode: ({ email, code }) => {
    return axiosClient.post(`/auth/verify-code`, { email, code });
  },
};

export default authApi;
