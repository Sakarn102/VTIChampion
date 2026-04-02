import axiosClient from "./axiosClient";

const classApi = {
    getAll: (params) => axiosClient.get("/classes", { params }),
    getStudentCounts: () => axiosClient.get("/classes/student-counts"),
    toggleStatus: (id) => axiosClient.put(`/classes/${id}/toggle-status`),
    getStudentsByClass: (id) => axiosClient.get(`/classes/${id}/students`),
    removeStudentFromClass: (classId, studentId) => axiosClient.delete(`/classes/${classId}/students/${studentId}`)
};

export default classApi;
