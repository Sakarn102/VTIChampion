import axiosClient from "./axiosClient";

const userApi = {
  // Thay đổi ENDPOINT dưới đây cho đúng với API backend của bạn
  // Ví dụ: "/users/me", "/auth/profile", "/accounts/my-profile", v.v...
  getProfile: () => {
    return axiosClient.get("/users/me"); 
  },
  getStudentsByTeacher: () => {
    return axiosClient.get("/users/teacher/my-students");
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
  toggleStatus: (id, isActive) => {
    return axiosClient.patch(`/admin/status/${id}`, null, {
      params: { active: isActive }
    });
  },
  update: (id, data) => {
    return axiosClient.put(`/users/${id}`, data);
  }
};

export default userApi;
