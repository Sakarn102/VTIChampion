import axiosClient from "./axiosClient";

const userApi = {
  // Thay đổi ENDPOINT dưới đây cho đúng với API backend của bạn
  // Ví dụ: "/users/me", "/auth/profile", "/accounts/my-profile", v.v...
  getProfile: () => {
    return axiosClient.get("/users/me"); 
  },
  updateProfile: (formData) => {
    return axiosClient.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAll: (params) => {
    return axiosClient.get("/users", { params });
  },
  delete: (id) => {
    return axiosClient.delete(`/users/${id}`);
  },
  update: (id, data) => {
    return axiosClient.put(`/users/${id}`, data);
  }
};

export default userApi;
