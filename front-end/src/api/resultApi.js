import axiosClient from "./axiosClient";

export const resultApi = {
    getResultsByExam: (examId) => axiosClient.get(`/results/teacher/exam/${examId}`),
    getHistory: () => axiosClient.get("/results/student/my-history"),
    getResultsByStudent: (userId) => axiosClient.get(`/results/teacher/student/${userId}`),
    getResultsByClass: (classId) => axiosClient.get(`/results/teacher/class/${classId}`),
};

export default resultApi;
