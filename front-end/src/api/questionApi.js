import axiosClient from "./axiosClient";

export const questionApi = {
    getMyQuestions: (params) => axiosClient.get("/questions/my-questions", { params }),
    createQuestion: (data) => axiosClient.post("/questions/create-question", data),
    updateQuestion: (id, data) => axiosClient.put(`/questions/update-question/${id}`, data),
    deleteQuestion: (id) => axiosClient.delete(`/questions/delete-question/${id}`),
};

export default questionApi;
