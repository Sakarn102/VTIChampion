import axiosClient from "./axiosClient";

export const takeExamApi = {
    startExam: (data) => axiosClient.post("/take-exam/start-exam", data),
    saveAnswer: (data) => axiosClient.post("/take-exam/save-answer", data),
    submitExam: (examResultId) => axiosClient.post(`/take-exam/submit/${examResultId}`),
    getQuestions: (examId) => axiosClient.get(`/questions/practice/exam/${examId}`),
};

export default takeExamApi;
