import axiosClient from "./axiosClient";

const classApi = {
    getAll: (params) => axiosClient.get("/classes", { params }),
    getStudentCounts: () => axiosClient.get("/classes/student-counts"),
    toggleStatus: (id) => axiosClient.put(`/classes/${id}/toggle-status`),
    getStudentsByClass: (id) => axiosClient.get(`/classes/${id}/students`),
    removeStudentFromClass: (classId, studentId) => axiosClient.delete(`/classes/${classId}/students/${studentId}`),
    
    // Management Helpers
    getDepartments: () => axiosClient.get("/admin/settings/type/2"),
    getTeachers: () => axiosClient.get("/admin/get-all-teacher?size=100"),
    create: (data) => axiosClient.post("/admin/create-class", data),
    update: (id, data) => axiosClient.put(`/admin/update-class/${id}`, data),
    delete: (id) => axiosClient.delete(`/admin/delete-class/${id}`),
    addStudentsToClass: (data) => axiosClient.post("/admin/add-students-to-class", data),
    getUnassignedStudents: () => axiosClient.get("/admin/unassigned-students"),
    // addStudentsToClass: (classId, studentIds) => axiosClient.post("/admin/add-students-to-class", { classId, studentIds }),
    getMyClass: () => axiosClient.get("/classes/my-class"),
};

export default classApi;
